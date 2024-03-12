import React, { useEffect } from 'react';
import ContactTable from '../components/ContactTable';
import { useAuth } from '../store/auth';
import SpinnerComp from '../components/SpinnerComp';
import { useNavigate } from 'react-router-dom';
const Contacts = () => {
  const navigate = useNavigate;
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    navigate('/logout');
  }
  return (
    <>
      <ContactTable />
    </>
  );
};

export default Contacts;
