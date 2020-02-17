## Calendar App  

  
### 1. 설치 및 실행 방법  
* **실행 편의를 위해, SPA로 빌드된 정적 파일들을 node 서버에서 Serving 하도록 구성하였음**

* Frontend App 빌드  
```  
$ cd frontend  
$ npm run deploy 	 // npm run install && npm run build
```  
*  서버 실행  
```  
$ cd backend  
$ npm run start 	// npm run install && babel-node init.js 실행
```  
* 브라우저에서 접속  
  * http://localhost:5000

* 정상 동작 확인 방법
  * 정상적으로 서버에서 데이터를 받아온 경우 2월 캘린더에 테스트 데이터가 조회된다.  
  
* 테스트 실행
  * npm run test:unit
  
### 2. 개발환경  
* Frontend  
  * Vue.js (vue-cli 3)
  * Webpack
  * Axios
  * moment
  * date-picker - [Examples | Vue date pick](https://dbrekalo.github.io/vue-date-pick/examples.html)
  * Jest/Vue-test-util
* Backend  
  * Node.js  
  * Express  
  * moment  
  * DB 연동 없이 메모리에서 데이터 관리하도록 구현함   
* Browser 
  * Chrome 

### 3.  프로젝트 폴더 구조  
 * Frontend
```  
├── public           // static files  
├── src  
│   ├── components   // 화면을 구성하는 컴포넌트
│   ├── mixins       // 컴포넌트에서 사용할 mixin  
│   ├── plugins      // Axios 플러그인 설정  
│   ├── router       // router 설정  
│   ├── service      // 실제 API를 호출하는 funtion   
│   ├── store        // Events 상태 관리 및 service 호출  
│   ├── styles       // Global style 관리  
│   ├── types        // 주요 타입 관리  
│   └── views        // 페이지 컴포넌트  
└── tests  
    └── unit         // Jest, vue-test-util 을 활용한 컴포넌트 테스트, 스냅샷 테스트  
```  
 * Backend
```  
├── constant         // Constant 관리  
├── controllers      // 라우팅을 처리하는 컨트롤러 함수 작성  
├── entity           // 데이터 Entity  
├── model            // Data Repository 역할  
├── public           // Front App 이 배포되면서 생성되는 
├── routers          // API Endpoint 라우팅  
└── util             // util 함수    
```  
  
### 4. 문제해결 전략  
* 날짜 모델  
```  
class Date {  
  constructor({ date, dateTime }) {  
    this.date = date  
    this.dateTime = dateTime  
  }  
}  
```  
* date와 datetime 으로 나누어 저장한다. 
  * date Format (local time zone으로, 필요한 단위까지만 저장하도록 구현하였음. 필요시 UTC 나 unix timestamp 로 개선 가능)
     * date: ‘YYYY-MM-DD’ 
     * datetime: ‘YYYY-MM-DD hh:mm’ 
*  **date 는 동일한 날짜끼리 Map 으로 분류하고, 이벤트가 속할 캘린더의 칸을 정할 때 사용한다.**

* 이벤트 모델  
```  
class Event {  
  constructor (obj) {  
    this.id = uuid();  
    this.title = obj.title;  
    this.start = new Date(obj.start);  
    this.end = new Date(obj.end);  
    this.createdAt = moment().format(dateFormat.DATE_TIME);  
  }  
}  
```  
* id는 unique한 값으로 서버에서 자동 생성된다.
* createdAt 날짜는 서버에서 자동 생성된다.

* 화면 구분
  * 화면은 크게 헤더와 캘린더 뷰 영역으로 나뉜다.  
    * 상단 헤더   
      * 이전/다음 페이지 이동 버튼, 타이틀, 월/주 전환 버튼으로 구성된다.  
    * 하단 캘린더 뷰  
      * 현재 날짜 기준으로 캘린더를 그린다.   
* View 모드
    * 사용자는 월별/주별로 등록된 일정을 확인할 수 있다.  
    * 월별/주별 버튼을 클릭하여 보기 모드를 변경할 수 있다.  
    * 디폴트 보기 모드는 월별 보기, 오늘 날짜 기준으로 표시한다.  
    * 월별 보기 모드
      * 해당 날짜에 여러 일정이 저장된 경우, 시간 순서대로 표시한다.  
      * 날짜칸을 선택하면 해당 날짜와 현재 시간이 디폴트로 셋팅된 추가팝업이 나타난다.  
    * 주별 보기 모드  
      * 가로 축은 요일을 나타내고, 세로 축은 24시간을 나타낸다.  
      * 시간칸을 선택하면 해당 날짜와 해당 시간이 디폴트로 셋팅된 추가팝업이 나타난다. 
      * 최대 1시간 제약 조건이 만족된다면 한 칸에 하나의 일정만 보여져야 한다.  
* 일정 추가/수정/삭제 모달 팝업  
    * **일정 시작시간과 종료시간은 서로 1시간 간격을 유지하도록 강제하여 1시간 제약 조건을 만족할 수 있도록 구현한다.**  
    * 추가: 일정 제목, 시작 시간, 종료 시간, 취소/저장 버튼이 존재한다.  
    * 수정: 일정 제목, 시작 시간, 종료 시간, 취소/저장/삭제 버튼이 존재한다.  
 * 데이터 Validation  
    * 동일한 시간에는 하나의 일정만 추가할 수 있다.  
	* **서버에서 다른 일정과 시작 날짜를 비교하여 시간 중복시 오류를 반환한다.**  
    * 화면에서는 제목에 대한 30자 길이 제한을 적용한다.  
    * API 요청 전, 비어있는 Input 이 존재하는 지 확인하고 Validation 메시지를 표시한다.  
* Drag&Drop   
    * 각 일정은 드래그앤드랍으로 날짜를 변경할 수 있다.  
       * **HTML 드래그 앤 드롭 API 를 활용하여 Drag&Drop 기능을 구현한다.**  

### 5. 컴포넌트 구성
````
├── components		// 화면을 구성하는 컴포넌트
│   ├── CalendarHeader.vue	// 캘린더 컨트롤을 포함한 헤더
│   ├── CalendarView.vue	// 캘린더 뷰 영역
│   ├── EventModal.vue		// 일정 관리를 위한 모달 팝업
│   └── view		
│       ├── Monthly.vue		// 월별 컴포넌트
│       └── Weekly.vue		// 주별 컴포넌트
└── views		// 페이지 컴포넌트
    └── Calendar.vue		// 컨테이너 컴포넌트
````
### 6. REST API  
* 모든 Endpoint는 /api 로 작한다.
* URI의 자원명은 일정을 나타내는 events 를 사용한다.  
* GET, POST, PUT, PATCH, DELET 메서드를 적절하게 사용한다.  
* 적절한 상태코드와 에러메시지를 반환한다.
* 200 Reponse 시, data 로 변경된 데이터를 함께 반환한다. 
````
Response: {
    result: boolean,
    message: string,
    data?: object
}
````
1. 일정 조회  
    * GET /api/events  
2. 일정 추가  
    * POST /api/events  
    * Body  
      * 일정 제목  
      * 시작 날짜  
      * 종료 날짜  
    * Error Status
      * 409 - 해당 날짜에 이벤트를 추가할 수 없는 경우
3. 일정 수정  
    * PUT /api/events/:id  
    * Body  
      * 일정 제목  
      * 시작 날짜  
      * 종료 날짜  
    * Error Status
      * 409 - 해당 날짜에 이벤트를 추가할 수 없는 경우
      * 404 - 동일한 id의 이벤트를 찾을 수 없는 경우
4. 일정 날짜 수정  
    * PATCH /api/events/:id  
    * Body  
      * 시작 날짜  
      * 종료 날짜  
    * Error Status
      * 409 - 해당 날짜에 이벤트를 추가할 수 없는 경우
      * 404 - 동일한 id의 이벤트를 찾을 수 없는 경우
5. 일정 삭제  
    * DELETE /api/events/:id  
    * Error Status
      * 400 - 필수 파라미터 id 전송하지 않은 경우
      * 404 - 동일한 id의 이벤트를 찾을 수 없는 경우
  
  
### Wrap-up  
* UI 요소  
  - [ ] alert 로 되어있는 팝업 처리 부분을 Toast 컴포넌트 등을 사용하도록 개선  
* 상태관리  
  * 현재 서버에서 받아오는 Events 를 상태로 관리하고 있음  
  * CRUD 요청을 actions 을 dispatch 해서 서버로 요청하도록 구현되어 있음  
  - [ ] CUD 요청 성공 시, 서버에서 data 로 Event 객체 반환해주는데 이를 상태에 바로 반영하는 방식으로 변경 필요 (현재는 getEvents 재호출)
* 전역 Mixin 사용  
  * template과 script에서 하나의 함수로 Date Formating를 하기 위해서 Mixin을 사용함  
  - [ ] 모든 컴포넌트에서 필요하므로 전역으로 사용했으나, 전역 Mixin 사용하는 것은 지양하는 것이 좋음  
* 단위테스트 코드 작성  
  * 컴포넌트 props, data, event, method call 등을 assert 하도록 작성하였음  
  - [ ] 테스트 커버리지가 높아지도록 다양한 테스트 코드를 작성할 필요가 있음  
  - [ ] vuex store 를 사용하는 경우 mock 코드가 많아져서 정리가 필요하다고 느낌  
* 레이아웃  
  - [ ] Monthly -> Grid
    * 각 칸의 높이가 inner element 개수에 상관없이 동일하게 유지하도록 개선  
    * 브라우저 창의 크기에 상관없이 full calendar 로 동작하도록 개선  
  * Weekly -> Table  
* DB 연동  
  - [ ] In-memory DB 인 Redis 연동해보기
* Typescript 적용  
  - [ ] Front-end
     * 시간: 시간객체를 함수나 props 에 전달하는데 string 인지 object 인지 명확히해야 함  
     * 일정 모델: Interface 나 Class 로 선언해놓고 사용하도록 개선하기
  - [ ] Back-end
