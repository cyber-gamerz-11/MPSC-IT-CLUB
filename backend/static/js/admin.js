// Admin Command Center Logic

document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    loadAllData();

    // Navigation Logic
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.dash-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const link = item.querySelector('a');
            if (!link || link.getAttribute('href') === '/') return;
            
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(sec => {
                sec.style.display = sec.id === `${targetId}-section` ? 'block' : 'none';
            });
        });
    });

    // Form Submissions
    handleAdminForm('add-event-form', '/admin/events/add');
    handleAdminForm('add-program-form', '/admin/programs/add');
    handleAdminForm('add-ec-form', '/admin/ec/add');
    handleAdminForm('add-gallery-form', '/admin/gallery/add');
});

async function fetchStats() {
    const res = await fetch('/admin/stats');
    const data = await res.json();
    document.getElementById('stat-members').innerText = data.total_users;
    document.getElementById('stat-events').innerText = data.total_events;
    document.getElementById('stat-payments').innerText = `${data.total_revenue} BDT`;
}

async function loadAllData() {
    const res = await fetch('/admin/api/all_data');
    const data = await res.json();

    // Render Events
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = data.events.map(ev => `
        <tr>
            <td>${ev.title}</td>
            <td>${ev.date}</td>
            <td>${ev.venue}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteItem('events', '${ev.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    // Render Programs
    const programsList = document.getElementById('programs-list');
    programsList.innerHTML = data.programs.map(pg => `
        <tr>
            <td><img src="${pg.banner || 'https://via.placeholder.com/50'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${pg.title}</td>
            <td>${pg.date || 'N/A'}</td>
            <td>${pg.description ? pg.description.substring(0, 40) + '...' : ''}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteItem('programs', '${pg.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    // Render Users
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = data.users.map(u => `
        <tr>
            <td>${u.full_name}</td>
            <td>${u.email}</td>
            <td><span class="role-badge role-${u.role}">${u.role}</span></td>
            <td>
                <select onchange="updateRole('${u.id}', this.value)" class="action-btn">
                    <option value="member" ${u.role === 'member' ? 'selected' : ''}>Member</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="ec" ${u.role === 'ec' ? 'selected' : ''}>EC</option>
                </select>
            </td>
        </tr>
    `).join('');

    // Render Payments
    fetchPendingPayments();

    // Render EC
    const ecList = document.getElementById('ec-list');
    ecList.innerHTML = data.ec_members.map(m => `
        <tr>
            <td>${m.name}</td>
            <td>${m.designation}</td>
            <td>${m.category || 'N/A'}</td>
            <td>${m.display_order}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteItem('ec_members', '${m.id}')">Remove</button>
            </td>
        </tr>
    `).join('');

    // Render Gallery
    const galleryList = document.getElementById('gallery-list');
    galleryList.innerHTML = data.gallery.map(img => `
        <tr>
            <td><img src="${img.url}" style="width: 50px; border-radius: 4px;"></td>
            <td>${img.caption || 'No Caption'}</td>
            <td>${img.category}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteItem('gallery', '${img.id}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

async function fetchPendingPayments() {
    const res = await fetch('/payments/all_pending');
    const data = await res.json();
    const list = document.getElementById('payments-list');
    list.innerHTML = data.map(p => `
        <tr>
            <td>${p.member_id}</td>
            <td>${p.ref_email}</td>
            <td>${p.transaction_id}</td>
            <td>
                <button class="action-btn" onclick="verifyPayment('${p.id}', 'approved')" style="border-color: var(--emerald-green);">Approve</button>
                <button class="action-btn delete-btn" onclick="verifyPayment('${p.id}', 'rejected')">Reject</button>
            </td>
        </tr>
    `).join('');
}

async function verifyPayment(id, status) {
    const res = await fetch('/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, status: status })
    });
    if (res.ok) {
        window.showToast(`Payment ${status}`, 'success');
        fetchPendingPayments();
    }
}

async function deleteItem(collection, id) {
    if (!confirm('Are you sure you want to delete this permanent?')) return;
    const res = await fetch(`/admin/api/delete/${collection}/${id}`, { method: 'DELETE' });
    if (res.ok) {
        window.showToast('Successfully removed', 'success');
        loadAllData();
        fetchStats();
    }
}

async function updateRole(userId, newRole) {
    const res = await fetch('/admin/api/users/update_role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole })
    });
    if (res.ok) {
        window.showToast('User role updated', 'success');
        loadAllData();
    }
}

function handleAdminForm(formId, url) {
    const form = document.getElementById(formId);
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span>Processing...`;
        
        try {
            const res = await fetch(url, { method: 'POST', body: new FormData(form) });
            if (res.ok) {
                window.showToast('Content Published!', 'success');
                form.reset();
                toggleModal(formId.replace('add-', '').replace('-form', '-modal'));
                loadAllData();
                fetchStats();
            } else {
                const err = await res.json();
                window.showToast(err.error || 'Server Error', 'error');
            }
        } catch (err) {
            console.error("Form Submit Error:", err);
            window.showToast('Network Error - Please check connection', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}
