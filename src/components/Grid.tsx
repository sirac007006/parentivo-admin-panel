// Wrapper za Grid komponentu da izbjegnemo TypeScript greške
import { Grid as MuiGrid, GridProps } from '@mui/material';

const Grid = (props: GridProps & { item?: boolean }) => {
  return <MuiGrid {...props} />;
};

export default Grid;
