import { useEffect, useState } from "react";
import { Divider } from "antd";
import toast from "react-hot-toast";

import TrendingServices from "../services/trendind/trendingservices";
import Adsbanner from "../home/addbanner/AdsBanner";
import Categories from "./categories/Categories";
import BrandProducts from "./product carosel/BrandProducts";
import ValueProps from "./valu/ValueProps";
import Retrowoodsb2b from "./b2b/Retrowoodsb2b";
import Footer from "../../components/footer/Footer";
import AboutContent from "../../components/about/AboutContent";
import ScrollingText from "../../components/scrlltext/ScrollingText";

import LoadingScreen from "../../components/loading/LoadingScreen"; // ✅ full-page loader
import "./Home.css";
import TestimonialCarousel from "../testimonial/TestimonialCarousel";
import FAQAccordion from "./faq/FAQAccordion";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
      
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
      } catch (err) {
        console.error("❌ Failed to load Home data:", err);
        toast.error("Failed to load Home page data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading Retro Woods..." />;
  }

  return (
    <div className="home-page">
      {/* Top Banner */}
      <Adsbanner />
<ScrollingText />
      {/* Categories Section */}
      <section className="home-section">
        <Categories toast={toast} />
      </section>

      {/* Trending Services */}
      <section className="home-section">
        <TrendingServices toast={toast} />
      </section>

      {/* Products by Brand */}
      <section className="home-container">
        <BrandProducts />
      </section>

      {/* Value Proposition */}
      <section className="home-section">
        <ValueProps />
      </section>

      {/* B2B Section */}
      <section className="home-container">
        <Retrowoodsb2b />
      </section>
      <section className="home-container">
        <TestimonialCarousel/>
      </section>

      <Divider />
<ScrollingText />
      {/* About Content Section */}
      <section className="home-section">
        <AboutContent />
      </section>
      <section className="home-section">
        <FAQAccordion />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
