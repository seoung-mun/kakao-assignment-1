/* ============================================================
   Todo App — app.js
   상태 기반 CRUD 관리 + localStorage 영속성
   ============================================================ */

// ===== 상수 정의 =====
const LOCAL_STORAGE_KEY = 'todo-app-items';

// ===== DOM 요소 캐싱 =====
const todoFormElement = document.getElementById('todo-form');
const todoInputElement = document.getElementById('todo-input');
const inputWrapperElement = document.getElementById('input-wrapper');
const inputErrorMessageElement = document.getElementById('input-error-message');
const todoListElement = document.getElementById('todo-list');
const emptyStateElement = document.getElementById('empty-state');
const statTotalElement = document.getElementById('stat-total');
const statCompletedElement = document.getElementById('stat-completed');
const statRemainingElement = document.getElementById('stat-remaining');


// ============================================================
// 상태 관리 (State Management)
// — 중앙 집중식 상태 배열을 유지하여 모든 UI 변경을 상태 기반으로 처리
// ============================================================

/**
 * loadTodosFromStorage
 * localStorage에서 저장된 Todo 데이터를 불러온다.
 * 데이터가 없거나 파싱에 실패하면 빈 배열을 반환한다.
 * @returns {Array} Todo 아이템 배열
 */
function loadTodosFromStorage() {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (parseError) {
    console.warn('localStorage 데이터 파싱 실패, 초기화합니다:', parseError);
    return [];
  }
}

/**
 * saveTodosToStorage
 * 현재 상태 배열을 localStorage에 JSON 문자열로 저장한다.
 * @param {Array} todoList - 저장할 Todo 아이템 배열
 */
function saveTodosToStorage(todoList) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList));
}

// — 앱의 중앙 상태: Todo 아이템 배열 —
// 각 아이템 구조: { id: number, text: string, isCompleted: boolean, createdAt: string }
let applicationState = loadTodosFromStorage();


// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * generateUniqueId
 * 타임스탬프와 랜덤 값을 결합하여 고유한 ID를 생성한다.
 * @returns {number} 고유 ID
 */
function generateUniqueId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * escapeHtmlEntities
 * XSS 방지를 위해 사용자 입력 텍스트의 HTML 특수문자를 이스케이프한다.
 * @param {string} unsafeText - 이스케이프할 텍스트
 * @returns {string} 안전한 텍스트
 */
function escapeHtmlEntities(unsafeText) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return unsafeText.replace(/[&<>"']/g, (char) => escapeMap[char]);
}


// ============================================================
// UI 렌더링 (Rendering)
// — 상태 배열을 기반으로 전체 UI를 다시 그린다
// ============================================================

/**
 * renderTodoList
 * applicationState 배열을 기반으로 Todo 리스트 전체를 DOM에 렌더링한다.
 * 빈 상태 표시 / 통계 업데이트도 함께 수행한다.
 */
function renderTodoList() {
  // 리스트 영역 초기화
  todoListElement.innerHTML = '';

  // 빈 상태 표시 토글
  if (applicationState.length === 0) {
    emptyStateElement.classList.remove('hidden');
  } else {
    emptyStateElement.classList.add('hidden');
  }

  // 각 Todo 아이템을 역순 없이 순서대로 렌더링 (최신이 위로 오도록 상태 관리 시 unshift 사용)
  applicationState.forEach((todoItem) => {
    const listItemElement = createTodoItemElement(todoItem);
    todoListElement.appendChild(listItemElement);
  });

  // 통계 업데이트
  updateStatistics();
}

/**
 * createTodoItemElement
 * 단일 Todo 아이템 데이터를 받아 해당하는 <li> DOM 요소를 생성한다.
 * @param {Object} todoItem - { id, text, isCompleted, createdAt }
 * @returns {HTMLLIElement} 생성된 리스트 아이템 요소
 */
function createTodoItemElement(todoItem) {
  const listItem = document.createElement('li');
  listItem.classList.add('todo-item');
  listItem.dataset.todoId = todoItem.id;

  // 완료 상태 반영
  if (todoItem.isCompleted) {
    listItem.classList.add('completed');
  }

  listItem.innerHTML = `
    <!-- 완료 토글 버튼: 원형 체크 표시 -->
    <button
      class="complete-button"
      data-action="toggle-complete"
      aria-label="${todoItem.isCompleted ? '완료 취소' : '완료하기'}"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Todo 텍스트 (보기 모드) -->
    <span class="todo-text">${escapeHtmlEntities(todoItem.text)}</span>

    <!-- Todo 수정 입력창 (편집 모드에서만 표시) -->
    <input
      type="text"
      class="edit-input"
      value="${escapeHtmlEntities(todoItem.text)}"
      data-action="edit-input"
      aria-label="할 일 수정"
    >

    <!-- 액션 버튼 그룹 -->
    <div class="todo-actions">
      <!-- 수정 버튼 (보기 모드) -->
      <button class="action-button edit-button" data-action="edit" aria-label="수정">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- 저장 버튼 (편집 모드) -->
      <button class="action-button save-button" data-action="save" aria-label="저장">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- 취소 버튼 (편집 모드) -->
      <button class="action-button cancel-button" data-action="cancel" aria-label="취소">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- 삭제 버튼 (보기 모드) -->
      <button class="action-button delete-button" data-action="delete" aria-label="삭제">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 4.5H13M5.5 4.5V3C5.5 2.45 5.95 2 6.5 2H9.5C10.05 2 10.5 2.45 10.5 3V4.5M6 7V11.5M8 7V11.5M10 7V11.5M4.5 4.5L5 13C5 13.55 5.45 14 6 14H10C10.55 14 11 13.55 11 13L11.5 4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  return listItem;
}

/**
 * updateStatistics
 * 헤더의 통계 숫자(전체, 완료, 남은 할 일)를 현재 상태 기반으로 업데이트한다.
 */
function updateStatistics() {
  const totalCount = applicationState.length;
  const completedCount = applicationState.filter((item) => item.isCompleted).length;
  const remainingCount = totalCount - completedCount;

  // 숫자 변경 시 바운스 애니메이션 적용
  animateStatUpdate(statTotalElement, totalCount);
  animateStatUpdate(statCompletedElement, completedCount);
  animateStatUpdate(statRemainingElement, remainingCount);
}

/**
 * animateStatUpdate
 * 통계 숫자 요소의 값이 변경되었을 때 미세한 바운스 애니메이션을 적용한다.
 * @param {HTMLElement} element - 업데이트할 숫자 요소
 * @param {number} newValue - 새로운 숫자 값
 */
function animateStatUpdate(element, newValue) {
  const currentValue = element.textContent;
  if (currentValue !== String(newValue)) {
    element.textContent = newValue;
    element.style.transform = 'scale(1.2)';
    element.style.transition = 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }
}


// ============================================================
// CRUD 연산 (Create, Read, Update, Delete)
// — 상태 배열을 변경한 후 저장 → 렌더링 순서로 처리
// ============================================================

/**
 * addNewTodo
 * 입력된 텍스트로 새로운 Todo 아이템을 생성하여 상태 배열 맨 앞에 추가한다.
 * 빈 입력값일 경우 에러 메시지를 표시하고 추가하지 않는다.
 * @param {string} inputText - 사용자가 입력한 할 일 텍스트
 * @returns {boolean} 추가 성공 여부
 */
function addNewTodo(inputText) {
  const trimmedText = inputText.trim();

  // 빈 입력값 검증
  if (trimmedText === '') {
    showInputError();
    return false;
  }

  // 새로운 Todo 아이템 객체 생성
  const newTodoItem = {
    id: generateUniqueId(),
    text: trimmedText,
    isCompleted: false,
    createdAt: new Date().toISOString()
  };

  // 상태 배열 맨 앞에 추가 (최신 항목이 위에 표시)
  applicationState.unshift(newTodoItem);

  // 저장 및 렌더링
  saveTodosToStorage(applicationState);
  renderTodoList();
  hideInputError();

  return true;
}

/**
 * toggleTodoCompletion
 * 지정된 ID의 Todo 아이템의 완료 상태를 토글한다.
 * @param {number} targetId - 토글할 Todo 아이템의 ID
 */
function toggleTodoCompletion(targetId) {
  const targetItem = applicationState.find((item) => item.id === targetId);
  if (targetItem) {
    targetItem.isCompleted = !targetItem.isCompleted;
    saveTodosToStorage(applicationState);
    renderTodoList();
  }
}

/**
 * updateTodoText
 * 지정된 ID의 Todo 아이템의 텍스트를 새 값으로 업데이트한다.
 * 빈 텍스트는 허용하지 않는다.
 * @param {number} targetId - 수정할 Todo 아이템의 ID
 * @param {string} newText - 새로운 텍스트
 * @returns {boolean} 수정 성공 여부
 */
function updateTodoText(targetId, newText) {
  const trimmedNewText = newText.trim();
  if (trimmedNewText === '') return false;

  const targetItem = applicationState.find((item) => item.id === targetId);
  if (targetItem) {
    targetItem.text = trimmedNewText;
    saveTodosToStorage(applicationState);
    renderTodoList();
    return true;
  }
  return false;
}

/**
 * deleteTodo
 * 지정된 ID의 Todo 아이템에 삭제 애니메이션을 적용한 뒤 상태에서 제거한다.
 * @param {number} targetId - 삭제할 Todo 아이템의 ID
 */
function deleteTodo(targetId) {
  // 삭제 애니메이션을 위해 DOM 요소를 먼저 찾는다
  const listItemElement = todoListElement.querySelector(`[data-todo-id="${targetId}"]`);

  if (listItemElement) {
    listItemElement.classList.add('removing');

    // 애니메이션 완료 후 상태에서 제거 및 리렌더링
    listItemElement.addEventListener('animationend', () => {
      applicationState = applicationState.filter((item) => item.id !== targetId);
      saveTodosToStorage(applicationState);
      renderTodoList();
    }, { once: true });
  } else {
    // DOM 요소가 없는 경우 바로 상태에서 제거
    applicationState = applicationState.filter((item) => item.id !== targetId);
    saveTodosToStorage(applicationState);
    renderTodoList();
  }
}


// ============================================================
// 입력 에러 표시/숨김
// ============================================================

/**
 * showInputError
 * 빈 입력값일 때 에러 메시지와 입력창 시각적 피드백을 표시한다.
 */
function showInputError() {
  inputWrapperElement.classList.add('has-error');
  inputErrorMessageElement.classList.add('visible');
  todoInputElement.setAttribute('aria-invalid', 'true');

  // 일정 시간 후 자동으로 에러 상태 해제
  setTimeout(() => {
    hideInputError();
  }, 2500);
}

/**
 * hideInputError
 * 에러 상태를 해제하고 시각적 피드백을 숨긴다.
 */
function hideInputError() {
  inputWrapperElement.classList.remove('has-error');
  inputErrorMessageElement.classList.remove('visible');
  todoInputElement.removeAttribute('aria-invalid');
}


// ============================================================
// 편집 모드 전환
// ============================================================

/**
 * enterEditMode
 * 지정된 Todo 아이템을 편집 모드로 전환한다.
 * 기존에 편집 중인 다른 아이템은 편집 모드를 해제한다.
 * @param {HTMLElement} listItemElement - 편집할 <li> 요소
 */
function enterEditMode(listItemElement) {
  // 다른 편집 중인 아이템의 편집 모드 해제
  const currentlyEditingItems = todoListElement.querySelectorAll('.todo-item.editing');
  currentlyEditingItems.forEach((editingItem) => {
    editingItem.classList.remove('editing');
  });

  // 현재 아이템을 편집 모드로 전환
  listItemElement.classList.add('editing');

  // 수정 입력창에 포커스 및 커서를 끝으로 이동
  const editInputElement = listItemElement.querySelector('.edit-input');
  if (editInputElement) {
    editInputElement.focus();
    editInputElement.setSelectionRange(
      editInputElement.value.length,
      editInputElement.value.length
    );
  }
}

/**
 * exitEditMode
 * 편집 모드를 해제하고 원래 텍스트로 복원한다.
 * @param {HTMLElement} listItemElement - 편집 모드를 해제할 <li> 요소
 */
function exitEditMode(listItemElement) {
  listItemElement.classList.remove('editing');

  // 수정 입력창을 원래 텍스트로 복원
  const todoId = Number(listItemElement.dataset.todoId);
  const originalItem = applicationState.find((item) => item.id === todoId);
  const editInputElement = listItemElement.querySelector('.edit-input');

  if (originalItem && editInputElement) {
    editInputElement.value = originalItem.text;
  }
}

/**
 * saveEdit
 * 편집 중인 Todo 아이템의 수정 내용을 저장한다.
 * @param {HTMLElement} listItemElement - 수정을 저장할 <li> 요소
 */
function saveEdit(listItemElement) {
  const todoId = Number(listItemElement.dataset.todoId);
  const editInputElement = listItemElement.querySelector('.edit-input');

  if (editInputElement) {
    const newText = editInputElement.value;
    const updateSuccess = updateTodoText(todoId, newText);

    if (!updateSuccess) {
      // 빈 텍스트인 경우 편집 입력창에 시각적 피드백
      editInputElement.style.borderColor = 'var(--color-danger)';
      setTimeout(() => {
        editInputElement.style.borderColor = 'var(--color-primary)';
      }, 800);
    }
  }
}


// ============================================================
// 이벤트 핸들러 바인딩 (Event Delegation)
// — 성능 최적화를 위해 부모 컨테이너에 이벤트를 위임한다
// ============================================================

/**
 * 폼 제출 이벤트: 새 Todo 추가
 * Enter 키 또는 추가 버튼 클릭 시 실행된다.
 */
todoFormElement.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();
  const inputText = todoInputElement.value;
  const isAdded = addNewTodo(inputText);

  if (isAdded) {
    todoInputElement.value = '';
    todoInputElement.focus();
  }
});

/**
 * 입력 중 에러 상태 자동 해제
 * 사용자가 타이핑을 시작하면 에러 메시지를 숨긴다.
 */
todoInputElement.addEventListener('input', () => {
  if (todoInputElement.value.trim() !== '') {
    hideInputError();
  }
});

/**
 * Todo 리스트 이벤트 위임 (Event Delegation)
 * — todoListElement에 단일 click 이벤트 리스너를 부착하여
 *   동적으로 생성되는 모든 Todo 아이템의 버튼 클릭을 처리한다.
 */
todoListElement.addEventListener('click', (clickEvent) => {
  // 클릭된 요소에서 가장 가까운 data-action 속성을 가진 요소를 찾는다
  const actionElement = clickEvent.target.closest('[data-action]');
  if (!actionElement) return;

  // 해당 Todo 아이템 <li> 요소를 찾는다
  const listItemElement = actionElement.closest('.todo-item');
  if (!listItemElement) return;

  const todoId = Number(listItemElement.dataset.todoId);
  const actionType = actionElement.dataset.action;

  // 액션 타입에 따라 적절한 함수를 호출한다
  switch (actionType) {
    case 'toggle-complete':
      toggleTodoCompletion(todoId);
      break;

    case 'edit':
      enterEditMode(listItemElement);
      break;

    case 'save':
      saveEdit(listItemElement);
      break;

    case 'cancel':
      exitEditMode(listItemElement);
      break;

    case 'delete':
      deleteTodo(todoId);
      break;
  }
});

/**
 * 수정 입력창에서 Enter/Escape 키 처리 (이벤트 위임)
 * — Enter: 수정 저장
 * — Escape: 수정 취소
 */
todoListElement.addEventListener('keydown', (keyEvent) => {
  const editInputElement = keyEvent.target.closest('[data-action="edit-input"]');
  if (!editInputElement) return;

  const listItemElement = editInputElement.closest('.todo-item');
  if (!listItemElement) return;

  if (keyEvent.key === 'Enter') {
    keyEvent.preventDefault();
    saveEdit(listItemElement);
  } else if (keyEvent.key === 'Escape') {
    keyEvent.preventDefault();
    exitEditMode(listItemElement);
  }
});


// ============================================================
// 초기화 (Initialization)
// — 앱 로드 시 localStorage에서 데이터를 불러와 렌더링한다
// ============================================================
renderTodoList();
