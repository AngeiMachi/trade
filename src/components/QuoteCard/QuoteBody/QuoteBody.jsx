import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'interval', headerName: 'Id', width: 20 },
    { field: 'timeNY', headerName: 'NY', width: 100 },
    { field: 'timeIL', headerName: 'IL', width: 100 },
    { field: 'signalType', headerName: 'Description', width: 450 },
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