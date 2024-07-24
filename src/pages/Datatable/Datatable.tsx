import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableOnee from '../../components/Datatable/TableOnee';
import TableThreee from '../../components/Datatable/TableThreee';
import TableTwoo from '../../components/Datatable/TableTwoo';

const Datatable = () => {
  return (
    <>
      <Breadcrumb pageName="Datatable" />

      <div className="flex flex-col gap-10">
        <TableOnee />
        <TableTwoo />
        <TableThreee />
      </div>
    </>
  );
};

export default Datatable;
