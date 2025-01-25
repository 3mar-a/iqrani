// التحقق من حالة تسجيل الدخول
const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
const updateUI = () => {
    const isLoggedIn = checkAuth();
    const authLinks = document.getElementById('authLinks');
    if (authLinks) {
        authLinks.innerHTML = isLoggedIn ? `
            <a href="/pages/profile.html">الملف الشخصي</a>
            <button onclick="handleLogout()" class="btn-secondary">تسجيل الخروج</button>
        ` : `
            <a href="/pages/auth/login.html">تسجيل الدخول</a>
            <a href="/pages/auth/register.html" class="btn-primary">إنشاء حساب</a>
        `;
    }
};

// معالجة تسجيل الدخول
const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
        email: form.email.value,
        password: form.password.value
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        window.location.href = '/';
    } catch (error) {
        alert(error.message);
    }
};

// معالجة إنشاء حساب جديد
const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value,
        phoneNumber: form.phoneNumber?.value,
        bookTypes: Array.from(form.querySelectorAll('input[name="bookTypes"]:checked')).map(input => input.value)
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        window.location.href = '/pages/auth/login.html';
    } catch (error) {
        alert(error.message);
    }
};

// معالجة تسجيل الخروج
const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
};

// إظهار/إخفاء حقول الكاتب في نموذج التسجيل
const toggleAuthorFields = () => {
    const roleSelect = document.getElementById('role');
    const authorFields = document.getElementById('authorFields');
    if (roleSelect && authorFields) {
        authorFields.style.display = roleSelect.value === 'author' ? 'block' : 'none';
    }
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // إضافة مستمعي الأحداث للنماذج
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        const roleSelect = document.getElementById('role');
        if (roleSelect) {
            roleSelect.addEventListener('change', toggleAuthorFields);
            toggleAuthorFields();
        }
    }
}); 