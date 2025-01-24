// التحقق من صلاحيات المستخدم
const checkAdminAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/pages/auth/login.html';
        return false;
    }
    return true;
};

// جلب الكتب المعلقة
const fetchPendingBooks = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/pending-books', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('خطأ في جلب الكتب المعلقة:', error);
        return [];
    }
};

// جلب أرباح الموقع
const fetchEarnings = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/earnings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('خطأ في جلب الأرباح:', error);
        return { total: 0 };
    }
};

// جلب أرباح الكتاب
const fetchAuthorsEarnings = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/authors-earnings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('خطأ في جلب أرباح الكتاب:', error);
        return [];
    }
};

// عرض الكتب المعلقة
const displayPendingBooks = (books) => {
    const tbody = document.getElementById('pendingBooks');
    if (!tbody) return;
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author.username}</td>
            <td>${book.price} ريال</td>
            <td>${book.category}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="handleBookAction('${book.id}', 'approve')" class="btn-approve">قبول</button>
                    <button onclick="handleBookAction('${book.id}', 'reject')" class="btn-reject">رفض</button>
                </div>
            </td>
        </tr>
    `).join('');
};

// معالجة إجراءات الكتب
const handleBookAction = async (bookId, action) => {
    try {
        const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        // تحديث القائمة
        const books = await fetchPendingBooks();
        displayPendingBooks(books);
    } catch (error) {
        alert(error.message);
    }
};

// تبديل التابات
const switchTab = (tabName) => {
    // إخفاء كل المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إزالة التنشيط من كل الأزرار
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // تنشيط التاب المحدد
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAdminAuth()) return;
    
    // إضافة مستمعي الأحداث للتابات
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // تحميل البيانات الأولية
    const [books, earnings, authors] = await Promise.all([
        fetchPendingBooks(),
        fetchEarnings(),
        fetchAuthorsEarnings()
    ]);
    
    displayPendingBooks(books);
    
    // عرض الأرباح
    const earningsAmount = document.getElementById('totalEarnings');
    if (earningsAmount) {
        earningsAmount.textContent = `${earnings.total} ريال`;
    }
    
    // عرض أرباح الكتاب
    const authorsList = document.getElementById('authorsList');
    if (authorsList) {
        authorsList.innerHTML = authors.map(author => `
            <tr>
                <td>${author.username}</td>
                <td>${author.email}</td>
                <td>${author.totalEarnings} ريال</td>
                <td>${author.balance} ريال</td>
            </tr>
        `).join('');
    }
}); 