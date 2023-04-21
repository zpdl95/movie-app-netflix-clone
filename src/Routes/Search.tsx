import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, IGetTVResult, IMovie, ITV, searchApi } from "../api";
import BigCenterBox from "../Components/BigCenterBox";
import Slider from "../Components/Slider";
import { Loader, SliderWrapper, Wrapper } from "./Home";

const SearchTitle = styled.h1`
  height: 50vh;
  font-size: 48px;
  padding-top: 100px;
  padding-left: 30px;
  color: ${(props) => props.theme.white.lighter};
`;

function Search() {
  const [query, setQuery] = useState<string | null>("");
  const location = useLocation();
  /* URLSearchParams = 자바스크립트에 있는 url파라미터를 찾아주는 함수 */
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery(
    ["search", query],
    () => searchApi.getMulti(query),
    {
      enabled: !!query,
    }
  );

  useEffect(() => {
    if (keyword !== null) {
      setQuery(keyword);
    }
  }, [keyword]);

  const bigSearchMatch = useRouteMatch<{ dataId: string; slideId: string }>(
    "/search/:slideId/:dataId"
  );

  const moviesResults: IMovie[] = data?.results?.filter(
    (d: { media_type: string }) => d.media_type === "movie"
  );

  const moviesData: IGetMoviesResult = {
    results: moviesResults,
  };

  const tvsResults: ITV[] = data?.results?.filter(
    (d: { media_type: string }) => d.media_type === "tv"
  );

  const tvsData: IGetTVResult = {
    results: tvsResults,
  };

  return (
    <Wrapper centerBox={!!bigSearchMatch}>
      <SearchTitle>Search for : {query}</SearchTitle>
      {isLoading && <Loader>Loading...</Loader>}
      {!isLoading && (
        <>
          <SliderWrapper>
            <Slider title="Movies ->" datas={moviesData} sliderid={"movie"} />
            <Slider title="TV Shows ->" datas={tvsData} sliderid={"tv"} />
          </SliderWrapper>
          <AnimatePresence>
            {bigSearchMatch && <BigCenterBox />}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;

// keyword가 변경되면 useQuery를 refetch하기
