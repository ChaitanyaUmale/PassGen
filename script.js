let storedPasswords = [];

function generatePassword() {
    const length = document.getElementById("length").value;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()";

    let validChars = lowercaseChars;
    if (includeUppercase) validChars += uppercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars[randomIndex];
    }

    document.getElementById("password").value = password;
    evaluateStrength(password);
}

function evaluateStrength(password) {
    let strengthBar = document.getElementById("strengthBar");
    let strength = password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()]/.test(password);
    strengthBar.className = "strength-bar " + (strength ? "strong" : password.length >= 8 ? "medium" : "weak");
}

function copyPassword() {
    const passwordField = document.getElementById("password");
    if (!passwordField.value) {
        alert("Generate a password first!");
        return;
    }
    passwordField.select();
    document.execCommand("copy");
    alert("Password copied to clipboard!");
}



function storePassword() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Enter an email and generate a password first!");
        return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, "SecretKey").toString();
    storedPasswords.push({ email, password: encryptedPassword });
    displayStoredPasswords();
}

function displayStoredPasswords() {
    const passwordList = document.getElementById("passwordList");
    passwordList.innerHTML = "";
    storedPasswords.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
            <strong>${entry.email}</strong>: (Encrypted)
            <button class="btn btn-info btn-sm" onclick="decryptPassword(${index})">View</button>
            <button class="btn btn-danger btn-sm float-end" onclick="deletePassword(${index})">Delete</button>`;
        passwordList.appendChild(li);
    });
}

function decryptPassword(index) {
    alert(`Decrypted Password: ${CryptoJS.AES.decrypt(storedPasswords[index].password, "SecretKey").toString(CryptoJS.enc.Utf8)}`);
}

function deletePassword(index) {
    storedPasswords.splice(index, 1);
    displayStoredPasswords();
}

function exportPasswords() {
    const blob = new Blob([JSON.stringify(storedPasswords)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "passwords.json";
    link.click();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}