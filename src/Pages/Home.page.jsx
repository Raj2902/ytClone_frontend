import CardShow from "../Components/Card.component";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function Home() {
  const data = useSelector((data) => data.allVideosData);
  const searchVideo = useSelector((data) => data.search);
  const [videoData, setVideoData] = useState(data);
  const [categories, setCategories] = useState([]);

  const [scrollValue, setScrollValue] = React.useState(0);

  const handleScrollChange = (event, newValue) => {
    setScrollValue(newValue);
  };
  useEffect(() => {
    let tempCategories = [];
    if (data) {
      data.map((asset) => {
        tempCategories = ["all", ...tempCategories, ...asset.categories];
        // console.log("Categories::", tempCategories);
      });
    }
    tempCategories = new Set(tempCategories);
    tempCategories = [...tempCategories];
    setCategories(tempCategories);
    setScrollValue(0);
  }, [data]);

  useEffect(() => {
    const allBtn = document.getElementById("all");
    if (allBtn) {
      allBtn.style.background = "black";
      allBtn.style.color = "white";
    }
  }, [categories]);

  //onchange of search term run this.
  // Note : the searching will be one whole data cancelling any other filter combination
  //data can be filter by title, category and tag, filter by channel name implemented
  useEffect(() => {
    setVideoData([
      ...data?.filter((video) => {
        if (
          JSON.stringify(video.tags)
            .toLowerCase()
            .includes(searchVideo.toLowerCase()) ||
          JSON.stringify(video.categories)
            .toLowerCase()
            .includes(searchVideo.toLowerCase()) ||
          video.title.toLowerCase().includes(searchVideo.toLowerCase())
        ) {
          return video;
        }
      }),
    ]);
  }, [searchVideo]);

  function handleCategory(event) {
    //handle active / inactive category
    const category = event.target.getAttribute("data-category");

    if (category.toLowerCase() == "all") {
      setVideoData([...data]);
    } else {
      setVideoData([
        ...data.filter((asset) => {
          return JSON.stringify(asset.categories)
            .toLowerCase()
            .includes(category.toLowerCase());
        }),
      ]);
    }
  }
  return (
    <>
      <div className="HomeContainer w-full">
        <div className="flex justify-center mb-5 w-full">
          <Box
            sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: "background.paper" }}
          >
            <Tabs
              value={scrollValue}
              onChange={handleScrollChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {categories.map((category) => (
                <Tab
                  key={category}
                  data-category={category}
                  onClick={handleCategory}
                  label={category}
                />
              ))}
            </Tabs>
          </Box>
        </div>
        <div className="cardGroup">
          {videoData &&
            videoData.map((asset) => {
              return <CardShow key={asset._id} asset={asset} />;
            })}
        </div>
      </div>
    </>
  );
}
