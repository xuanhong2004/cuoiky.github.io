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

let products = [];

// Tải dữ liệu sản phẩm từ file JSON và cập nhật giỏ hàng
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    updateCart(); // Cập nhật giỏ hàng sau khi tải dữ liệu sản phẩm
  });

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ localStorage
  const cartItemsContainer = document.getElementById("cart-items");
  let subtotal = 0;

  cartItemsContainer.innerHTML = ""; // Xóa nội dung cũ của giỏ hàng

  if (cart.length === 0) {
    // Nếu giỏ hàng trống, hiển thị thông báo
    cartItemsContainer.innerHTML =
      '<tr><td colspan="5">Giỏ hàng trống</td></tr>';
  } else {
    // Nếu giỏ hàng có sản phẩm, hiển thị từng sản phẩm
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="product-info">
            <img src="${product.image}" alt="${
          product.name
        }" style="width: 50px; height: auto; margin-right: 10px;" />
            <span>${product.name}</span>
          </td>
          <td>${product.price.toLocaleString()} đ</td>
          <td>
            <button class="quantity-btn small-btn decrease" onclick="changeQuantity('${
              item.id
            }', -1)">-</button>
            <span class="quantity" data-id="${item.id}">${item.quantity}</span>
            <button class="quantity-btn small-btn increase" onclick="changeQuantity('${
              item.id
            }', 1)">+</button>
          </td>
          <td class="total-price total" data-id="${item.id}">${(
          product.price * item.quantity
        ).toLocaleString()} đ</td>
          <td><button class="remove-btn" onclick="removeItem('${
            item.id
          }')">Xóa</button></td>
        `;
        cartItemsContainer.appendChild(row);
        subtotal += product.price * item.quantity; // Tính tổng giá trị sản phẩm
      }
    });

    // Cập nhật tổng giá trị sản phẩm và tổng cộng
    document.getElementById("subtotal").innerText =
      subtotal.toLocaleString() + " đ";
    document.getElementById("total").innerText =
      (subtotal + 50000).toLocaleString() + " đ"; // Thêm phí vận chuyển
  }
}

function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    // Kiểm tra giỏ hàng trống trước khi thanh toán
    alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
  } else {
    window.location.href = "checkout.html"; // Chuyển hướng đến trang thanh toán
  }
}

function changeQuantity(id, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change; // Thay đổi số lượng sản phẩm
    if (cart[itemIndex].quantity < 1) {
      cart[itemIndex].quantity = 1; // Đảm bảo số lượng không nhỏ hơn 1
    }

    fetch("products.json")
      .then((response) => response.json())
      .then((products) => {
        const product = products.find((p) => p.id === id);
        if (product) {
          cart[itemIndex].total = product.price * cart[itemIndex].quantity; // Cập nhật tổng giá trị sản phẩm
          localStorage.setItem("cart", JSON.stringify(cart)); // Lưu giỏ hàng vào localStorage

          // Cập nhật số lượng và tổng giá trị trên giao diện
          const quantityElement = document.querySelector(
            `#cart-items .quantity[data-id="${id}"]`
          );
          const totalElement = document.querySelector(
            `#cart-items .total[data-id="${id}"]`
          );

          if (quantityElement) {
            quantityElement.innerText = cart[itemIndex].quantity;
          }
          if (totalElement) {
            totalElement.innerText =
              cart[itemIndex].total.toLocaleString() + " đ";
          }

          updateTotal(); // Cập nhật tổng giá trị
        }
      });
  }
}

function updateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity; // Tính tổng giá trị sản phẩm
    }
  });

  // Cập nhật tổng giá trị sản phẩm và tổng cộng
  document.getElementById("subtotal").innerText =
    subtotal.toLocaleString() + " đ";
  document.getElementById("total").innerText =
    (subtotal + 50000).toLocaleString() + " đ"; // Thêm phí vận chuyển
}

function removeItem(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id); // Xóa sản phẩm khỏi giỏ hàng
    localStorage.setItem("cart", JSON.stringify(cart)); // Lưu giỏ hàng vào localStorage
    updateCart(); // Cập nhật giỏ hàng
    updateTotal(); // Cập nhật tổng giá trị
  }
}

updateCart(); // Cập nhật giỏ hàng khi trang được tải
