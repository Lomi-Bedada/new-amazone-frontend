import CarouselEffect from "../../Components/Carousel/Carousel.jsx";
import Category from "../../Components/Categorys/Category.jsx";
import LayOut from "../../Layouts/Layout.jsx";
import MainProduct from "../../Components/Products/MainProduct.jsx";
import React from "react";

const Landing = () => {
  return (
    <LayOut>
      <CarouselEffect />
      <Category />
      <MainProduct />
    </LayOut>
  );
};

export default Landing;
