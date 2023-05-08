import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { IGetTVResult, tvApi } from '../api';
import BigCenterBox from '../Components/BigCenterBox';
import Slider, { NEXFLIX_LOGO_URL } from '../Components/Slider';
import { makeImagePath } from '../utils';
import {
  Banner,
  BannerInfo,
  Loader,
  Overview,
  SliderWrapper,
  Title,
  Wrapper,
} from './Home';

function TV() {
  const [bannerIndex, setBannerIndex] = useState(0);

  const { data: airingTodayData, isLoading: airingTodayIsLoading } =
    useQuery<IGetTVResult>(['tv', 'airingToday'], tvApi.getAiringToday);
  const { data: popularData, isLoading: popularIsLoading } =
    useQuery<IGetTVResult>(['tv', 'popular'], tvApi.getPopular);
  const { data: topRatedData, isLoading: topRatedIsLoading } =
    useQuery<IGetTVResult>(['tv', 'topRated'], tvApi.getTopRated);

  const bigTVMatch = useRouteMatch<{ dataId: string; slideId: string }>(
    '/tvs/:slideId/:dataId'
  );

  const loading = airingTodayIsLoading || popularIsLoading || topRatedIsLoading;

  useEffect(() => {
    if (airingTodayData) {
      setBannerIndex(
        Math.floor(Math.random() * airingTodayData.results.length)
      );
    }
  }, [airingTodayData]);

  return (
    <>
      {loading && <Loader>Loading...</Loader>}
      {!loading && (
        <Wrapper centerBox={!!bigTVMatch}>
          <Banner
            bgphoto={
              (airingTodayData?.results[bannerIndex].backdrop_path &&
                makeImagePath(
                  airingTodayData.results[bannerIndex].backdrop_path
                )) ??
              NEXFLIX_LOGO_URL
            }
          >
            <BannerInfo>
              <Title>{airingTodayData?.results[bannerIndex].name}</Title>
              <Overview>
                {airingTodayData?.results[bannerIndex].overview}
              </Overview>
            </BannerInfo>
          </Banner>

          <SliderWrapper>
            <Slider
              title='Airing Today TV Shows'
              datas={airingTodayData}
              sliderid={'now_playing'}
            />
            <Slider
              title='Popular TV Shows'
              datas={popularData}
              sliderid={'popular'}
            />
            <Slider
              title='Top Rated TV Shows'
              datas={topRatedData}
              sliderid={'top_rated'}
            />
          </SliderWrapper>
          <AnimatePresence>{bigTVMatch && <BigCenterBox />}</AnimatePresence>
        </Wrapper>
      )}
    </>
  );
}
export default TV;
