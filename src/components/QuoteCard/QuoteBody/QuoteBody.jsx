
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  root: {
    '& .positive': {
      backgroundColor: 'green',
    },
    '& .negative': {
      backgroundColor: 'red',
    },
  },
});

const columns = [
  { field: 'interval', headerName: 'Id', width: 20 ,hide: true },
  { field: 'timeNY', headerName: 'NY', width: 80 , hide: true},
  { field: 'timeIL', headerName: 'Time', width: 89 },
  { field: 'price', headerName: 'Price', width: 105 , valueFormatter: (params,props) => {
    const pcnt = (params.value-params.row.prevPrice) / params.value * 100.0
    return `${params.value}(${pcnt.toFixed(1)})%`;
  }},
  { field: 'signalDetails', headerName: 'Description', width: 250 , valueFormatter: ({ value }) => value.signalDescription}
  
];
const  QuoteCardBody = (props) => {
  const classes = useStyles();
  const {signals,prevDayPrice} = props;

  const [sortModel, setSortModel] = useState([
        {
          field: 'interval',
          sort: 'desc',
        },
      ]);

  return (
      <>
        
        <div style={{  width: '100%' }} className={classes.root}>
            <DataGrid rows={signals.map(obj=> ({ ...obj, prevPrice: prevDayPrice }))}
                      columns={columns}
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
                          return params.value >= prevDayPrice ? 'positive' : 'negative';
                        }   
                      }}
                      disableColumnMenu={true}
              />
        </div>
        </>
  );
}

export default QuoteCardBody;