from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PostCreate, PostResponse, UserRead, UserCreate, UserUpdate
from .db import Post, create_db_and_tables, get_async_session, User
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select
from .images import imagekit
import shutil
import os
import uuid
import tempfile
from .users import auth_backend, current_active_user, fastapi_users

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(
    lifespan=lifespan,
    title="FeedHub API",
    description="Media Gallery Management System",
    version="0.1.0"
)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix='/auth/jwt', tags=['auth'])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_reset_password_router(), prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_verify_router(UserRead), prefix='/auth', tags=['auth'])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix='/users', tags=['users'])

@app.post('/auth/jwt/login-response', summary="Login with response", tags=['auth'])
async def login_with_response(
    user: User = Depends(current_active_user),
) -> UserRead:
    """
    Return authenticated user data after login.
    Used after the cookie-based login sets the HTTP-only cookie.
    """
    return UserRead.model_validate(user)

@app.post('/auth/jwt/logout', summary="Logout and clear cookie", tags=['auth'])
async def logout(response: Response, user: User = Depends(current_active_user)):
    """
    Logout user by clearing the HTTP-only authentication cookie.
    """
    response.delete_cookie(
        key='authToken',
        path='/',
        domain=None,
        secure=False,  # Set to True in production with HTTPS
        httponly=True,
        samesite='lax',
    )
    return {'message': 'Successfully logged out'}

@app.post('/upload', summary="Upload media file", tags=["media"])
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(''),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Upload a media file (image or video) with optional caption.
    
    - **file**: The media file to upload
    - **caption**: Optional description for the media
    - **Returns**: Post object with file details and metadata
    """
    
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        with open(temp_file_path, 'rb') as f:
            upload_result = await imagekit.files.upload(
                file=f,
                file_name=file.filename,
                use_unique_file_name=True,
                tags=['backend-upload']
            )

        if upload_result.file_id:
            post = Post(
                user_id = user.id,
                caption = caption,
                url = upload_result.url,
                file_type = 'video' if file.content_type.startswith('video/') else 'image',
                file_name = upload_result.name
            )
            session.add(post)
            await session.commit()
            await session.refresh(post)
            return post
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        file.file.close()


@app.get('/feed', summary="Get all posts", tags=["posts"])
async def get_feed(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user)
):
    """
    Retrieve all posts from all users ordered by creation date (newest first).
    
    - **Returns**: List of posts with user information and ownership status
    """
    result = await session.execute(select(Post).order_by(Post.created_at.desc()))
    posts = [row[0] for row in result.all()]

    results = await session.execute(select(User))
    users = [row[0] for row in result.all()]
    user_dict = {u.id: u.email for u in users}

    posts_data = []
    for post in posts:
        posts_data.append({
            'id': str(post.id),
            'user_id': str(post.user_id),
            'caption': post.caption,
            'url': post.url,
            'file_type': post.file_type,
            'file_name': post.file_name,
            'created_at': post.created_at.isoformat(),
            'is_owner': post.user_id == user.id,
            'email': user_dict.get(post.user_id, 'unknown')
        })

    return {'posts': posts_data}

@app.delete('/posts/{post_id}', summary="Delete a post", tags=["posts"])
async def delete_post(post_id: str, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_user),):
    """
    Delete a post by ID. Only the post owner can delete their post.
    
    - **post_id**: UUID of the post to delete
    - **Returns**: Success message if deletion was successful
    - **403 Forbidden**: If user is not the post owner
    - **404 Not Found**: If post does not exist
    """
    try:
        post_uuid = uuid.UUID(post_id)

        result = await session.execute(select(Post).where(Post.id == post_uuid))
        post = result.scalars().first()

        if not post:
            raise HTTPException(status_code=404, detail='Post not found')
        
        if post.user_id != user.id:
            raise HTTPException(status_code=403, detail='You do not have permission to delete this post')
        
        await session.delete(post)
        await session.commit()

        return {"success": True, 'message': 'Post deleted successfully'}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))