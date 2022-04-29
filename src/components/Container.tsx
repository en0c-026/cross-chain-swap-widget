import { Box } from 'grommet'
import React, { ReactNode } from 'react';
import { CustomBox } from '../models'

type ContainerProps = {
  style: CustomBox;
  children: ReactNode;
  id?: string;
}

export default function Container({ children, style, id }: ContainerProps) {
  return (
    <Box
    id={id}
      align={style.align}
      alignContent={style.alignContent}
      alignSelf={style.alignSelf}
      background={style.background}
      border={style.border}
      direction={style.direction}
      elevation={style.elevation}
      fill={style.fill}
      focusIndicator={style.focusIndicator}
      flex={style.flex}
      gap={style.gap}
      height={style.height}
      justify={style.justify}
      margin={style.margin}
      pad={style.pad}
      responsive={style.responsive}
      round={style.round}
      width={style.width}
    >
      {children}
    </Box>
  )
}