import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { IGetMoviesResult, IGetTVResult } from '../api';
import { movieGenres } from '../movieGenres';
import { makeImagePath } from '../utils';

export const NEXFLIX_LOGO_URL =
  'https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4';

const Wrapper = styled(motion.div)`
  width: 100%;
  height: 16em;
  user-select: none;
  position: relative;
`;

const RowTitle = styled.h3`
  margin-bottom: 0.5em;
  padding: 0 3em;
  font-size: 1.5em;
  color: ${(props) => props.theme.white.darker};
`;

const BeforeAfterBtn = styled(motion.div)`
  width: 100%;
  height: 11em;
  position: absolute;
`;

const BeforeBtn = styled(motion.button)`
  height: 100%;
  width: 3em;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 0.3em;
  svg {
    fill: #ffffffd8;
  }
`;

const AfterBtn = styled(BeforeBtn)`
  right: 0;
`;

const RowGrid = styled(motion.div)`
  width: 100%;
  height: 11em;
  padding: 0 3em;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.3em;
  /* 애니메이션 이동시 겹쳐지게 하기위함 */
  position: absolute;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  border-radius: 0.3em;
  cursor: pointer;
`;

const Info = styled(motion.div)`
  height: 50%;
  width: 100%;
  padding: 0.4em;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  bottom: -5.45em;
  border-bottom-left-radius: 0.3em;
  border-bottom-right-radius: 0.3em;
`;

const InfoTitle = styled.h4`
  text-align: center;
  font-size: 1em;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  &:last-child {
    align-items: center;
  }
  span {
    font-size: 0.7em;
    &:first-child {
      margin-bottom: 0.3em;
    }
  }
`;

const InfoSub = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1em;
  span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const rowVariants: Variants = {
  hidden: (sliderSize) => ({ x: sliderSize - 10 }),
  visible: { x: 0, transition: { type: 'tween', duration: 1 } },
  exit: (sliderSize) => ({
    x: -sliderSize + 10,
    transition: { type: 'tween', duration: 1 },
  }),
};

const beforeAfterBtnVariants: Variants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

/* 애니메이션 값에 em, rem 값을 사용하면 버그가 생김 */
const boxVariants: Variants = {
  hover: {
    scale: 1.3,
    y: -130,
    transition: { type: 'tween', delay: 0.6, duration: 0.2 },
  },
};

const infoVariants: Variants = {
  initial: {
    opacity: 0,
    pointerEvents: 'none',
  },
  hover: {
    opacity: 1,
    pointerEvents: 'auto',
    transition: { type: 'tween', delay: 0.6, duration: 0.2 },
  },
};

interface ISlider {
  datas: IGetMoviesResult | IGetTVResult | undefined;
  title: string;
  sliderid: string;
}

function Slider({ datas, title, sliderid }: ISlider) {
  const [offset, setOffset] = useState(6);
  const history = useHistory();
  /* Row가 사라지는 상태를 저장. 애니메이션이 안 겹치게 하기 위함 */
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [nextSlider, setNextSlider] = useState(true);
  const [sliderSize, setSliderSize] = useState(window.innerWidth);
  const nowLocation = useRouteMatch<{ location: string }>('/:location');

  const onBoxClicked = (dataId: number) => {
    history.push({
      pathname: nowLocation
        ? `/${nowLocation.params.location}/${sliderid}/${dataId}`
        : `/movies/${sliderid}/${dataId}`,
      state: { sliderData: datas },
    });
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (datas) {
      if (leaving) return;
      setLeaving(true);
      setNextSlider(true);
      const totalData = datas.results.length;
      const maxIndex = Math.floor(totalData / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (datas) {
      if (leaving) return;
      setLeaving(true);
      setNextSlider(false);
      const totalData = datas.results.length;
      const maxIndex = Math.floor(totalData / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  window.addEventListener('resize', () => setSliderSize(window.innerWidth));

  return (
    <Wrapper whileHover={'hover'} initial={'initial'}>
      <RowTitle>{title}</RowTitle>
      <BeforeAfterBtn variants={beforeAfterBtnVariants}>
        <BeforeBtn onClick={decreaseIndex}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
            <path d='M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z' />
          </svg>
        </BeforeBtn>
        <AfterBtn onClick={increaseIndex}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
            <path d='M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z' />
          </svg>
        </AfterBtn>
      </BeforeAfterBtn>
      {/* onExitComplete = 애니메이션이 완료되면 함수가 실해됨 */}
      {/* initial={false}처럼 컴포넌트가 mount됐을때 초기 위치or애니메이션을 제거할 수 있다 */}
      <AnimatePresence
        custom={nextSlider ? sliderSize : -sliderSize}
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <RowGrid
          custom={nextSlider ? sliderSize : -sliderSize}
          variants={rowVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          key={index}
        >
          {datas?.results
            ?.slice(offset * index, offset * index + offset)
            .map((data: any, index: number) => (
              <AnimatePresence key={data.id}>
                <Box
                  style={{ originX: index === 0 ? 0 : index === 5 ? 1 : 0.5 }}
                  layoutId={sliderid + data.id}
                  variants={boxVariants}
                  whileHover={'hover'}
                  initial={'initial'}
                  transition={{ type: 'tween' }}
                  key={data.id}
                  bgPhoto={
                    data.backdrop_path
                      ? makeImagePath(data.backdrop_path, 'w500')
                      : NEXFLIX_LOGO_URL
                  }
                  onClick={() => onBoxClicked(data.id)}
                >
                  <Info variants={infoVariants}>
                    <InfoTitle>{data.title || data.name}</InfoTitle>
                    <InfoSub>
                      <InfoCol>
                        <span>{data.release_date || data.first_air_date}</span>
                        <span>
                          {data.genre_ids.map((i: any) =>
                            movieGenres.map((g) => g.id === i && `${g.name} `)
                          )}
                        </span>
                      </InfoCol>
                      <InfoCol>
                        <span style={{ fontSize: 15 }}>⭐</span>
                        <span>{data.vote_average}</span>
                      </InfoCol>
                    </InfoSub>
                  </Info>
                </Box>
              </AnimatePresence>
            ))}
        </RowGrid>
      </AnimatePresence>
    </Wrapper>
  );
}
export default Slider;

// 호버박스 미디어쿼리 써서 글자크기 변경
