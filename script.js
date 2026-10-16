const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#contact-name");
const emailInput = document.querySelector("#contact-email");
const typeSelect = document.querySelector("#contact-type");
const typeGuide = document.querySelector("#contact-type-guide");
const messageInput = document.querySelector("#contact-message");
const messageCount = document.querySelector("#message-count");
const statusMessage = document.querySelector("#contact-status");
const submitButton = document.querySelector("#contact-submit");
const tabButtons = [...document.querySelectorAll("[role='tab']")];
const tabPanels = [...document.querySelectorAll("[role='tabpanel']")];

const typeGuides = {
    usage: "사용 중인 Python 버전과 진행한 단계를 함께 적어 주세요.",
    bug: "오류가 발생한 상황과 표시된 메시지를 함께 적어 주세요.",
    feature: "만들고 싶은 화면이나 필요한 동작을 구체적으로 적어 주세요."
};

function setFormState(message = "", type = "") {
    statusMessage.textContent = message;
    statusMessage.className = `form-status${type ? ` is-${type}` : ""}`;
    submitButton.textContent = type === "success" ? "전송 완료" : type === "error" ? "입력 다시 확인" : "문의 보내기";
    submitButton.disabled = type === "success";
}

function selectTab(selectedButton) {
    const selectedTab = selectedButton.dataset.tab;

    tabButtons.forEach((button) => {
        const isSelected = button === selectedButton;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-selected", String(isSelected));
        button.tabIndex = isSelected ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== selectedTab;
    });
}

function updateMessageCount() {
    const length = messageInput.value.trim().length;
    const isReady = length >= 10;

    messageCount.textContent = isReady ? `${length}자 입력 · 전송할 수 있습니다.` : `${length}자 입력 · 최소 10자`;
    messageCount.classList.toggle("is-ready", isReady);
}

function updateTypeGuide() {
    const guide = typeGuides[typeSelect.value];

    typeGuide.textContent = guide || "유형을 선택하면 작성 안내가 표시됩니다.";
    typeGuide.classList.toggle("is-selected", Boolean(guide));
    setFormState();
}

function validateContact() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const type = typeSelect.value;
    const message = messageInput.value.trim();

    if (!name || !email || !type || !message) {
        return { message: "이름, 이메일, 문의 유형, 문의 내용을 모두 입력해 주세요.", field: !name ? nameInput : !email ? emailInput : !type ? typeSelect : messageInput };
    }

    if (!emailInput.validity.valid) {
        return { message: "올바른 이메일 주소를 입력해 주세요.", field: emailInput };
    }

    if (message.length < 10) {
        return { message: "문의 내용은 10자 이상 입력해 주세요.", field: messageInput };
    }

    return { message: `${name}님의 문의를 전송했습니다.` };
}

function handleSubmit(event) {
    event.preventDefault();
    const result = validateContact();
    const type = result.field ? "error" : "success";

    setFormState(result.message, type);
    result.field?.focus();
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("input", () => {
    updateMessageCount();
    setFormState();
});
typeSelect.addEventListener("change", updateTypeGuide);

tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectTab(button));
    button.addEventListener("keydown", (event) => {
        const directions = { ArrowLeft: -1, ArrowRight: 1 };
        let nextIndex;

        if (event.key in directions) {
            nextIndex = (index + directions[event.key] + tabButtons.length) % tabButtons.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = tabButtons.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        selectTab(tabButtons[nextIndex]);
        tabButtons[nextIndex].focus();
    });
});
