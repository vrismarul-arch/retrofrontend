import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../../api";
import { useCart } from "../../../context/CartContext";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "./BrandProducts.css";

export default function BestSellers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const scrollRef = useRef(null);

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const prodRes = await api.get(`/api/admin/products`);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error("❌ Best sellers fetch error:", err);
        toast.error("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleAddToCartClick = async (product) => {
    if (!isLoggedIn) {
      toast("Please login first", { icon: "🔑" });
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, 1, product);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      toast.error("Could not add to cart");
    }
  };

  const handleRemoveFromCartClick = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed from cart");
    } catch (err) {
      console.error("❌ Remove from cart failed:", err);
      toast.error("Could not remove from cart");
    }
  };

  const isInCart = (productId) =>
    cart.some((item) => item.product._id === productId);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ✅ Auto slider infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          // Instantly jump back to start
          scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
        } else {
          // Keep sliding right
          scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 4000); // slide every 4 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: "relative", my: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
        Best Sellers
      </Typography>
      <hr className="home-title-hr" />
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : products.length > 0 ? (
        <Box sx={{ position: "relative" }}>
          {/* Scroll Buttons */}
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "40%",
              left: -10,
              zIndex: 5,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              boxShadow: 2,
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "40%",
              right: -10,
              zIndex: 5,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              boxShadow: 2,
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Scrollable container */}
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              gap: 2,
              px: 1,
              py: 2,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {products.map((product) => (
              <Box
                key={product._id}
                sx={{
                  flex: "0 0 auto",
                  width: { xs: "100%", sm: "48%", md: "32%", lg: "24%" },
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                  bgcolor: "background.paper",
                }}
              >
                {/* Image */}
                <Box sx={{ position: "relative" }}>
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      height: "60px",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    }}
                  />
                  {product.discount && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "error.main",
                        color: "#fff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 600,
                        boxShadow: 2,
                      }}
                    >
                      {product.discount}% OFF
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "warning.main",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      boxShadow: 2,
                    }}
                  >
                    Best Seller
                  </Box>
                </Box>

                {/* Info & buttons */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {product.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mr: 1 }}
                    >
                      ₹{roundPrice(product.price)}
                    </Typography>
                    {product.originalPrice > product.price && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        ₹{roundPrice(product.originalPrice)}
                      </Typography>
                    )}
                  </Box>

                  {isInCart(product._id) ? (
                    <Button
                      fullWidth
                      startIcon={<MinusOutlined />}
                      onClick={() => handleRemoveFromCartClick(product._id)}
                      style={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        borderRadius: "25px",
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      REMOVE
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<PlusOutlined />}
                      onClick={() => handleAddToCartClick(product)}
                      style={{
                        backgroundColor: "#000000ff",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        borderRadius: "25px",
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <PlusOutlined /> ADD
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography>No best-selling products found.</Typography>
      )}
    </Box>
  );
}
