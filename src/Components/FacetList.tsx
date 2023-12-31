import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Facet from './Facet';

const FacetList = () => {
  return (
    <Box>
      <Box px={1} pb={1}>
        <Typography variant="overline">Refine By</Typography>
        <Facet field="ec_brand" title="Brand" />
        <Facet field="objecttype" title="Object Type" />
        <Facet field="filetype" title="File Type" />
      </Box>
    </Box>
  );
};

export default FacetList;
