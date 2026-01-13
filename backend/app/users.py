import uuid
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin, models
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from .db import User, get_user_db

SECRET = 'kjhgagfsjmafssa57'

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user, request = None):
        print(f'User {user.id} has registered')
        return await super().on_after_register(user, request)
    
    async def on_after_forgot_password(self, user, token, request = None):
        return await super().on_after_forgot_password(user, token, request)
    
    async def on_after_request_verify(self, user, token, request = None):
        return await super().on_after_request_verify(user, token, request)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

# Use CookieTransport instead of BearerTransport for HTTP-only cookies
cookie_transport = CookieTransport(
    cookie_name='authToken',
    cookie_max_age=604800,  # 7 days
    cookie_secure=False,  # Set to True in production (HTTPS)
    cookie_httponly=True,  # Prevent JavaScript access
    cookie_samesite='lax',  # CSRF protection
)

def get_jwt_strategy():
    return JWTStrategy(secret=SECRET, lifetime_seconds=604800)  # 7 days

auth_backend = AuthenticationBackend(
    name='jwt',
    transport=cookie_transport,
    get_strategy=get_jwt_strategy
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)