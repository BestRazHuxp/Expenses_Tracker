// 1. Lay cac phan tu HTML va cau hinh hien thi tien, ngay gio.
const filterForm = document.getElementById("transaction-filter");
const rows = document.getElementById("transaction-rows");
const status = document.getElementById("transaction-status");
const moneyFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND"
});
const dateFormat = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh"
});

// 2. Goi API va hien thi danh sach giao dich trong bang.
async function loadTransactions() {
    const button = filterForm.querySelector("button");
    button.disabled = true;
    rows.replaceChildren();
    status.textContent = "Đang tải giao dịch…";
    try {
        const period = document.getElementById("period").value;
        const response = await fetch("/api/transactions?" + new URLSearchParams({ period }));
        if (!response.ok) throw new Error("Không tải được giao dịch.");
        const transactions = await response.json();
        transactions.sort((a, b) => b.created_at.localeCompare(a.created_at));
        for (const transaction of transactions) {
            // SQLite stores UTC without a timezone suffix; Z makes it explicit.
            const date = new Date(transaction.created_at.replace(" ", "T") + "Z");
            const income = Number(transaction.coefficient) === 1;
            const option = Array.from(document.getElementById("category_adding").options)
                .find(item => item.value === String(transaction.category_id));
            const values = [
                Number.isNaN(date.getTime()) ? "Ngày không hợp lệ" : dateFormat.format(date),
                income ? "Thu nhập" : "Chi tiêu",
                moneyFormat.format(transaction.amount),
                option?.textContent || (transaction.category_id == null ? "Chưa có danh mục" : "Danh mục #" + transaction.category_id),
                transaction.note || "—"
            ];
            const row = document.createElement("tr");
            values.forEach((value, index) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                if (index === 2) cell.className = "amount " + (income ? "income" : "expense");
                row.appendChild(cell);
            });
            rows.appendChild(row);
        }
        status.textContent = transactions.length
            ? transactions.length + " giao dịch trong khoảng đã chọn."
            : "Không có giao dịch trong khoảng đã chọn.";
    } catch (error) {
        rows.replaceChildren();
        status.textContent = "Không tải được giao dịch. Hãy bấm View để thử lại.";
    } finally {
        button.disabled = false;
    }
}

// 3. Bam View: loc giao dich ma khong chuyen trang.
filterForm.addEventListener("submit", event => {
    event.preventDefault();
    loadTransactions();
});

// 4. Bam Add: luu giao dich, sau do tai lai bang.
document.getElementById("transaction-add").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button");
    const message = document.getElementById("add-status");
    button.disabled = true;
    message.textContent = "Đang lưu…";
    try {
        const response = await fetch(form.action, {
            method: "POST", body: new URLSearchParams(new FormData(form))
        });
        if (!response.ok) throw new Error("Save failed");
        form.reset();
        message.textContent = "Đã thêm giao dịch.";
        await loadTransactions();
    } catch (error) {
        message.textContent = "Không lưu được giao dịch. Vui lòng kiểm tra lại.";
    } finally {
        button.disabled = false;
    }
});

// 5. Khi mo trang: doi danh muc tai xong roi moi tai bang.
categoriesReady.finally(loadTransactions);
