import { Divider } from "antd"; // Added Divider import
import toast from "react-hot-toast";

import TrendingServices from "../services/trendind/trendingservices";
import Adsbanner from "../home/addbanner/AdsBanner";
import Categories from "./categories/Categories";
import BrandProducts from "./product carosel/BrandProducts";
import ValueProps from "./valu/ValueProps";
import LegacySection from "./LegacySection";
import Retrowoodsb2b from "./b2b/Retrowoodsb2b";
import Footer from "../../components/footer/Footer";
import AboutContent from "../../components/about/AboutContent";

import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* Top Banner */}
      <Adsbanner />

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

      {/* Legacy Section */}
        {/* <section className="home-section">
          <LegacySection />
        </section> */}

      {/* B2B Section */}
      <section className="home-container">
        <Retrowoodsb2b />
      </section>

      <Divider />

      {/* About Content Section */}
      <section className="home-section">
        <AboutContent />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
