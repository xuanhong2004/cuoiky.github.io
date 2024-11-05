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

// Tải thông tin sản phẩm từ file JSON
fetch("products.json")
  .then((response) => response.json())
  .then((products) => {
    // Tìm sản phẩm theo ID
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Cập nhật thông tin sản phẩm trên trang
      document.getElementById("product-image").src = product.image;
      document.getElementById("product-name").innerText = product.name;
      document.getElementById("product-price").innerText =
        "Giá: " + product.price.toLocaleString() + " đ";
      document.getElementById("product-description").innerText =
        product.description; // Gọi mô tả từ JSON
    }
  });

// Hàm thay đổi số lượng sản phẩm
function changeQuantity(change) {
  const quantityElement = document.getElementById("quantity");
  let currentQuantity = parseInt(quantityElement.innerText);
  currentQuantity += change;

  // Đảm bảo số lượng không nhỏ hơn 1
  if (currentQuantity < 1) {
    currentQuantity = 1;
  }
  quantityElement.innerText = currentQuantity; // Cập nhật số lượng
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart() {
  const quantityElement = document.getElementById("quantity");
  const quantity = parseInt(quantityElement.innerText);
  const cartItem = {
    id: productId,
    quantity: quantity,
  };

  // Lưu vào localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);
  if (existingItemIndex > -1) {
    // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Nếu không, thêm sản phẩm mới vào giỏ
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Lưu giỏ hàng vào localStorage
  alert("Sản phẩm đã được thêm vào giỏ hàng!");
}
