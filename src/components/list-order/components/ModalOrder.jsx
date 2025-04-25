import React, { useRef } from 'react';
import { Button, Modal, Image, Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

const PrintableContent = React.forwardRef((props, ref) => {
  const {
    article, postingNumber, name, photo,
    Column22, Column14, Column15, Column16,
    Column17, Column18, Column19, Column20
  } = props;

  return (
    <div ref={ref}>
      <Modal.Header closeButton>
        <Modal.Title>
          {`${name}`} <br />
          {`Цвет: ${Column22}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={photo} fluid />
        <Table striped="columns">
          <thead>
            <tr>
              <th>№</th>
              <th>Комплектация</th>
            </tr>
          </thead>
          <tbody>
            {[Column14, Column15, Column16, Column17, Column18, Column19, Column20]
              .filter(Boolean)
              .map((value, i) => (
                <tr key={i}><td>{i + 1}</td><td>{value}</td></tr>
              ))}
          </tbody>
        </Table>
      </Modal.Body>
    </div>
  );
});

const ModalOrder = ({ dataOrder, handleClose, show }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Order Details',
  });

  return (
    <Modal size='lg' show={show} onHide={handleClose}>
      <PrintableContent ref={printRef} {...dataOrder} />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
        <Button variant="primary" onClick={handlePrint}>Печать</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalOrder;
