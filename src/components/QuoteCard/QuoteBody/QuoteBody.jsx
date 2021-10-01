import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'interval', headerName: 'Id', width: 20 ,hide: true },
    { field: 'timeNY', headerName: 'NY', width: 80 , hide: true},
    { field: 'timeIL', headerName: 'Time', width: 100 },
    { field: 'signalDetails', headerName: 'Description', width: 450 , valueFormatter: ({ value }) => value.signalDescription},
  ];

const  QuoteCardBody = ({signals}) => {
  
  const [sortModel, setSortModel] = useState([
        {
          field: 'interval',
          sort: 'desc',
        },
      ]);

  return (
      <>
        
        <div style={{  width: '100%' }}>
            <DataGrid rows={signals}
                      columns={columns}
                      getRowId={(row) => row.id}
                      showPagination ={false} 
                      sortModel={sortModel}
                      autoHeight={true}
                      rowHeight={30}
                      headerHeight={30}
                      hideFooter={true}
                      onSortModelChange={(model) => setSortModel(model)}
              />
        </div>
        </>
  );
}

export default QuoteCardBody;