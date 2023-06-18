
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import styled from '@emotion/styled';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .positive': {
    backgroundColor: 'green',
  },
  '& .negative': {
    backgroundColor: 'red',
  },
}));

const columns = [
  { field: 'interval', headerName: 'Id', width: 20 },
  { field: 'timeNY', headerName: 'NY', width: 80 },
  { field: 'timeIL', headerName: 'Time', width: 89 },
  { field: 'price', headerName: 'Price', width: 105 , 
  
    valueGetter: (params,props) => {
    const pcnt = (params.value-params.row?.prevPrice) / params.value * 100.0
    return `${params.value}(${pcnt.toFixed(1)})%`;
  }},
  { field: 'signalDetails', headerName: 'Description', width: 250 , valueFormatter: ({ value }) => value.signalDescription}
  
];

const columnsVisibilityModel = {
  interval:false,
  timeNY:false
}
const  QuoteCardBody = (props) => {
  // const classes = useStyles();
  const {signals,prevDayPrice} = props;

  const [sortModel, setSortModel] = useState([
        {
          field: 'interval',
          sort: 'desc',
        },
      ]);

  return (
      <>
        
        <div style={{  width: '100%' }}>
            <StyledDataGrid rows={signals.map(obj=> ({ ...obj, prevPrice: prevDayPrice }))}
                      columns={columns}
                      columnVisibilityModel={columnsVisibilityModel}
                      getRowId={(row) => row.id}
                      showPagination ={false} 
                      sortModel={sortModel}
                      autoHeight={true}
                      rowHeight={30}
                      headerHeight={30}
                      hideFooter={true}
                      
                      onSortModelChange={(model) => setSortModel(model) }
                      getCellClassName={(params) => {
                        if (params.field === 'price') {
                          return params.row.price >= prevDayPrice ? 'positive' : 'negative';
                        }   
                      }}
                      disableColumnMenu={true}
              />
        </div>
        </>
  );
}

export default QuoteCardBody;