const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#contact-name");
const emailInput = document.querySelector("#contact-email");
const messageInput = document.querySelector("#contact-message");
const statusMessage = document.querySelector("#contact-status");
const submitButton = document.querySelector("#contact-submit");

function setFormState(message = "", type = "") {
    statusMessage.textContent = message;
    statusMessage.className = `form-status${type ? ` is-${type}` : ""}`;
    submitButton.textContent = type === "success" ? "확인 완료" : type === "error" ? "입력 다시 확인" : "문의 내용 확인";
    submitButton.disabled = type === "success";
}

function validateContact() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        return { message: "이름, 이메일, 문의 내용을 모두 입력해 주세요.", field: !name ? nameInput : !email ? emailInput : messageInput };
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
form.addEventListener("input", () => setFormState());
