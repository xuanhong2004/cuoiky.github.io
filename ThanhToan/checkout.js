// Lấy header và footer từ file header_footer.html
fetch("/ThanhToan/header_footer.html")
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    document.getElementById("header-placeholder").innerHTML =
      doc.querySelector("header").outerHTML;
    document.getElementById("footer-placeholder").innerHTML =
      doc.querySelector("footer").outerHTML;
  });

// Hàm lọc ký tự không hợp lệ trong trường số điện thoại
function validatePhoneInput(input) {
  // Chỉ cho phép các ký tự số và dấu +
  input.value = input.value.replace(/[^0-9+]/g, "");
}

// Hàm tải thông tin đơn hàng từ giỏ hàng
function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items-summary");
  let subtotal = 0;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Giỏ hàng trống</p>";
  } else {
    fetch("products.json")
      .then((response) => response.json())
      .then((products) => {
        cart.forEach((item) => {
          const product = products.find((p) => p.id === item.id);
          if (product) {
            const itemElement = document.createElement("div");
            itemElement.classList.add("order-item");
            itemElement.innerHTML = `
              <span>${product.name} x ${item.quantity}</span>
              <span>${(product.price * item.quantity).toLocaleString()} đ</span>
            `;
            cartItemsContainer.appendChild(itemElement);
            subtotal += product.price * item.quantity;
          }
        });

        document.getElementById("subtotal-amount").innerText =
          subtotal.toLocaleString() + " đ";
        document.getElementById("shipping-fee").innerText = "50.000 đ";
        document.getElementById("total-amount").innerText =
          (subtotal + 50000).toLocaleString() + " đ";
      });
  }
}

// Hàm xác thực thông tin khách hàng
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert(
      "Vui lòng điền đầy đủ thông tin bắt buộc: Họ tên, Số điện thoại và Địa chỉ."
    );
    return false;
  }

  processPayment();
  return false;
}

// Hàm xử lý thanh toán
function processPayment() {
  alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
  localStorage.removeItem("cart");
  window.location.href = "/baitapnhom/Trangchu.html";
}

// Tải thông tin đơn hàng khi trang được mở
window.onload = loadOrderSummary;
