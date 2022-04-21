import { Box } from 'grommet'
import { h, ComponentChildren } from 'preact'
import { CustomBox } from '../models'

type ContainerProps = {
  style: CustomBox;
  children: ComponentChildren
}

export default function Container({ children, style }: ContainerProps) {
  return (
    <Box
      align={style.align}
      alignContent={style.alignContent}
      alignSelf={style.alignSelf}
      background={style.background}
      border={style.border}
      direction={style.direction}
      elevation={style.elevation}
      fill={style.fill}
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