# MyNeflix
TMDB에서 영화정보 데이터를 가져와
영화정보를 분류하고, 맘에 들면 wishlist에 저장/보관 할 수있는 사이트입니다.

Vue를 사용했고, 사이트 디자인은 전반적으로 bootstrap-vue3를 사용했습니다.

배포자동화는 Neflify를 이용해서 정적으로 호스팅하게 만들었습니다.

# 설치 및 실행
메인 디렉토리에서

-모듈 설치 및 실행준비
npm install

-컴파일 하고 싶을 때
npm run build

-로컬로 서버를 돌리고싶을 때
npm run serve

# 폴더 구조
public과 src폴더가 있습니다.

public
간단한 타이틀 변경 및 아이콘 변경이 가능한 폴더입니다.

src
├─assets

├─components

├─router

├─store

└─views

assets은 사진과 같은 이미지 및 사이트를 만들 때 필요한 소스가 저장된 폴더입니다.

components는 components들이 모여있는 폴더입니다.

router는 어떤 view아래 vue 파일들로 갈지 경로 설정하는 곳입니다.

store는 vuex로 vue에서 상호작용하는 데이터를 관리하는 곳입니다.

views는 기본적으로 view에서 작성된 vue파일들 위에 components의 vue파일들이 올라가는 구조입니다.

# 개발가이드
기본적으로 만들고 싶은 페이지가 있을 때 브랜치를 만들고 커밋한 후 버그가 없음이 확인되면

main_master_deploy라는 main 브랜치와 병합합니다.

feature 브랜치 : component 성질을 띄는 vue파일을 작성할 때 사용합니다

develop 브랜치 : views 폴더에 들어갈 vue파일을 작성할 때 사용합니다.


