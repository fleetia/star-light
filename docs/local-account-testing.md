# 로컬 계정 테스트

KBO Knit의 작업 중인 코드를 `http://localhost:5173`에서 실행하고 배포된 Iserlohn test backend로 로그인·계정·클라우드 저장을 확인하는 절차다. 로컬 UI는 현재 working tree를 사용한다. 이 절차는 hosted test KBO의 소스나 배포 산출물을 갱신하지 않는다.

## 시작하기

프로젝트의 pinned pnpm과 설치된 의존성을 사용한다. 추가 runtime dependency나 로컬 인증 secret은 필요하지 않다. 현재 네트워크의 외부 IP가 Iserlohn test 배포의 `allowedSourceIps`에 등록되어 있어야 한다.

1. 기존 shell 및 `.env*`의 `VITE_API_BASE_URL` 설정을 제거한다. DEV 기본값인 상대 경로를 사용해야 한다.
2. KBO Knit repository에서 실행한다.

   ```bash
   unset VITE_API_BASE_URL
   pnpm dev
   ```

3. 정확히 [http://localhost:5173](http://localhost:5173)을 연다. `127.0.0.1`, 다른 포트, `--host` override는 지원하지 않는다. 포트가 사용 중이면 해당 프로세스를 확인하고 다시 실행한다.
4. **로그인 / 가입**을 누른다. `/auth?returnTo=kbo-knit-local`에서 기존 계정은 username과 password로 로그인한다. 새 계정은 별도의 회원가입 화면에서 username과 password를 등록한다. 인증 후 같은 로컬 앱으로 돌아온다.

새 가입에는 이메일을 수집하지 않으며, 메일 수신이나 SES 설정은 필요하지 않다. 비밀번호 재설정은 아직 지원하지 않는다. Stibee transactional mail은 향후 연동 대상이다. 배포된 test portal이 아직 이전 OTP 화면이면 password revision 배포 완료를 확인한 뒤 이 절차를 진행한다.

기존 계정에 username/password가 없으면 유효한 기존 세션으로 계정 화면에서 설정한다. 기존 세션도 없다면 운영자 복구가 필요하다. 기본 비밀번호를 만들거나 이메일 일치만으로 새 계정에 접근권한을 부여하지 않는다.

## 확인할 동작

로그인 후 username 표시, 새로고침 시 로그인 유지, 로그아웃을 확인한다. 일반 계정은 로그인해도 로컬 저장을 사용한다. 후원 권한은 가입·로그인과 별도로 연결된다. 새 계정은 자동으로 후원 계정이 되지 않으며, 기존 verified-email 계정의 후원 권한은 유지한다. 후원 권한이 연결된 계정은 편집·새로고침 후 클라우드 동기화를 확인한다. 저장과 계정 변경은 실제 test account 데이터에 반영된다.

Hosted portal에서 이미 로그인했더라도 로컬에서는 별도로 로그인한다. 두 브라우저 세션은 분리되어 있지만 같은 username 계정의 test backend 데이터는 공유한다.

## 연결과 쿠키 경계

[`dev/accountProxy.ts`](../dev/accountProxy.ts)는 로컬 계정 페이지(`/auth`, `/account`, `/privacy`, `/terms`), portal assets, `/api/auth/*`, `/v1/*`를 `https://iserlohn-test.star-light.space`로 전달한다. loopback 연결, 정확한 Host, API의 Origin 또는 Referer를 확인한 뒤 upstream 인증 origin을 적용한다.

HTTP localhost에서는 브라우저 호환성을 위해 응답의 두 `__Host-iserlohn-*` cookie를 `iserlohn-local-session`과 `iserlohn-local-preauth`로 바꾸고 `Secure`만 제거한다. `HttpOnly`, `SameSite=Lax`, `Path=/`, 만료 조건은 유지한다. 요청 시 두 local cookie만 upstream 이름으로 되돌린다. 이 변환은 guarded Vite dev proxy에만 있으며, backend와 hosted production/test cookie 속성은 바뀌지 않는다.

`kbo-knit-local`은 backend의 test stage에서만 허용하며 반환 URL은 `http://localhost:5173/`로 고정된다. `pnpm preview`와 production build에는 dev proxy가 없다. Hosted test build의 `VITE_API_BASE_URL` 설정은 별도 [Iserlohn 배포 절차](../../iserlohn/README.md#build-inspect-and-deploy)를 따른다.

DEV에서는 Service Worker를 새로 등록하지 않고 같은 origin의 root registration을 해제한다. 기존 탭은 해제 직후에도 이전 worker의 제어를 받을 수 있으므로 오래된 화면이 보이면 탭을 닫고 다시 연다.

## 연결이 실패하면

- 로컬 proxy의 403: 주소가 `http://localhost:5173`인지 확인한다. API를 주소창에 직접 열면 Origin/Referer 검증 때문에 거부될 수 있다.
- 배포된 test API의 403: 현재 외부 IP와 test allowlist를 확인한다. VPN이나 네트워크 변경으로 외부 IP가 달라질 수 있다.
- 로그인 후 로컬로 돌아오지 않음: `VITE_API_BASE_URL`이 남아 있는지, 로그인 URL의 식별자가 `kbo-knit-local`인지 확인한다.
- 가입 실패: 가입 허용 상태, username 중복 여부와 입력 조건을 확인한다.
- 로그인 실패: username/password와 요청 제한을 확인한다. 비밀번호를 잊었다면 메일 재설정 기능이 없으므로 운영자 복구가 필요하다.

Proxy 경로·cookie mapping·고정 origin을 변경할 때 이 문서와 backend 반환 대상 검증을 함께 확인한다.
