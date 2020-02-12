# kakaopay
## Calendar App

### Content


#### 1. 개발환경
* Frontend
	* Vue.js
	* moment
	* date-picker (TBD)
* Backend
	* Node.js
	* Express
* 
####  2. 빌드 방법
#### 3. 실행 방법
#### 4. 문제해결 전략
* 사용자는 월별/주별로 등록된 일정을 확인할 수 있다.
	* 월/주 변경 스위치로 변경할 수 있고, 클릭시마다 API 조회한다.
	* 현재 선택한 날짜를 저장해야 한다. 디폴트는 오늘 날짜/시간대로 설정한다.
* 화면은 총 2개의 분할된 화면을 표시한다.
	* 상단 Control View 
		* CalendarControl.vue
		* <, >, 현재 월/주 표시, 월/주 전환 버튼으로 구성되며, 각각은 일반적인 기능대로 동작한다.
	* 하단 Calendar View
		* CalendarView.vue
		* 월/주 선택에 따라 뷰가 전환된다.
		* 월
			* 해당 날짜에 여러 일정이 저장된 경우, 시간 순서대로 표시한다.
			* 날짜를 선택하면 해당 날짜와 현재 시간이 디폴트로 셋팅된 추가팝업이 나타난다.
			* 시간은 현재 시간을 기준으로 한시간 단위로 설정할 수 있다.
			* 팝업에서 약속시간과 제목을 입력할 수 있고, 취소/저장 버튼이 존재한다.
		* 주
			* 가로 축 - 요일 / 세로 축 - 24 시간
			* 일시간 단위 일정은 해당 시간대에 표시한다. -> ?
			* 날짜의 시간을 선택하면 해당 날짜와 선택시간이 디폴드로 셋팅된 추가팝업이 나타난다.
* 일정 추가/수정/삭제 팝업
	* 추가: 일정 제목, 시간 선택 콤보박스, 취소/저장 버튼이 존재한다.
	* 수정: 저장된 제목, 시간이 표시되고 변경 가능하며, 저장/삭제/취소 버튼이 존재한다.
* 예외처리
	* 각 일정 추가 및 변경 시 다른 일정과의 데이터 검증을 하며 시간 중복 시 오류를 표시한다.
	* 모든 일정의 단위는 1시간 단위로만 생성 가능하다.
	* 각 일정은 드래그앤드랍으로 일 단위를 변경할 수 있다.
