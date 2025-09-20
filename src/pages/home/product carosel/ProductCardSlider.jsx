import React from "react";
import { Card, Rate, Tag } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductCardSlide.css"; // custom css

const { Meta } = Card;

const products = [
  {
    id: 1,
    title: "ShapeSense Orthopedic Classic Memory Foam Mattress | 10...",
    price: "₹7,499",
    oldPrice: "₹12,498",
    discount: "40% off",
    rating: 4.5,
    reviews: "4.5L",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  {
    id: 2,
    title: "Elevate Pocket Spring Mattress",
    price: "₹8,899",
    oldPrice: "₹13,699",
    discount: "35% off",
    rating: 4.4,
    reviews: "9K",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  {
    id: 2,
    title: "Elevate Pocket Spring Mattress",
    price: "₹8,899",
    oldPrice: "₹13,699",
    discount: "35% off",
    rating: 4.4,
    reviews: "9K",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  {
    id: 3,
    title: "Elevate Pocket Spring Mattress",
    price: "₹8,899",
    oldPrice: "₹13,699",
    discount: "35% off",
    rating: 4.4,
    reviews: "9K",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  {
    id: 4,
    title: "Elevate Pocket Spring Mattress",
    price: "₹8,899",
    oldPrice: "₹13,699",
    discount: "35% off",
    rating: 4.4,
    reviews: "9K",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  {
    id: 5,
    title: "Elevate Pocket Spring Mattress",
    price: "₹8,899",
    oldPrice: "₹13,699",
    discount: "35% off",
    rating: 4.4,
    reviews: "9K",
    image: "https://via.placeholder.com/250x150",
    tag: "Best Seller",
  },
  // ... add more products
];

export default function ProductCardSlide() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992, // tablet
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576, // mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="product-card-slide">
      <Slider {...settings}>
        {products.map((item) => (
          <div key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.title} src={item.image} />}
              className="product-card"
            >
              <Tag color="green">{item.tag}</Tag>
              <Meta
                title={item.title}
                description={
                  <>
                    <div className="price">
                      <span className="new">{item.price}</span>
                      <span className="old">{item.oldPrice}</span>
                      <span className="discount">{item.discount}</span>
                    </div>
                    <div className="rating">
                      <Rate disabled defaultValue={item.rating} allowHalf />
                      <span>{item.reviews}</span>
                    </div>
                  </>
                }
              />
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}
