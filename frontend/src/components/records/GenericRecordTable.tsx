import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { api } from '../../redux/api';
import { toast } from 'react-toastify';

interface GenericRecordTableProps {
  // redux state methods
  fetchRecordStart: () => void;
  fetchRecordSuccess: (records: any[]) => void;
  fetchRecordFailure: (error: string) => void;
  stateAddRecord: (record: any) => void;
  stateRemoveRecord: (id: number) => void;
  stateUpdateRecord: (record: any) => void;
  
  // API methods
  getRecords: (plantId: number) => Promise<any[]>;
  addRecord: (plantId: number, record: any) => Promise<any>;
  updateRecord: (plantId: number, record: any) => Promise<any>;
  deleteRecord: (plantId: number, recordId: number) => Promise<any>;

  // Table columns
  recordedValueName: string; // height, amount, temperature, etc.
}