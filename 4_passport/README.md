# 참고

라우터 MVC에 맞게 분리해야하는데 귀찮아서 안함!

server_me에서 주석만 체크하고 전체 로직은 server.js에서 확인

## Passport.js

passport를 사용해서 OAuth2.0 구현

passport.authenticate('google')으로 구글 로그인 인증/콜백 처리를 할 수 있음

- (Client) 로그인 버튼 클릭 (id/pw 입력)
- (Server) 사용자 요청 정보를 받아서 google로 권한 요청
- (Server) 미리 지정한 콜백 주소(auth/google/callback)로 접근 코드 받음
- (Server) 접근 코드로 사용자 정보 구글에 요청
- (Server) 사용자 정보를 받아서 DB에 저장하고 세션에 저장
- (Server) 세션 토큰 생성하고 쿠키 보관
- (Client) 쿠키에 세션 토큰 저장
