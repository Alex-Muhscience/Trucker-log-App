import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LogForm.css';

const LogForm = () => {
  const logSchema = Yup.object().shape({
    currentLocation: Yup.string().required('Current location is required'),
    pickupLocation: Yup.string().required('Pickup location is required'),
    dropoffLocation: Yup.string().required('Dropoff location is required'),
    currentCycleUsed: Yup.number()
      .required('Current cycle used is required')
      .moreThan(0, 'Current cycle used must be greater than 0'),
  });

  return (
    <div className="log-form">
      <h2>Log Entry Form</h2>
      <Formik
        initialValues={{
          currentLocation: '',
          pickupLocation: '',
          dropoffLocation: '',
          currentCycleUsed: '',
        }}
        validationSchema={logSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {formik => (
          <Form>
            <Field type="text" name="currentLocation" placeholder="Current Location" />
            <ErrorMessage name="currentLocation" component="div" />
            <Field type="text" name="pickupLocation" placeholder="Pickup Location" />
            <ErrorMessage name="pickupLocation" component="div" />
            <Field type="text" name="dropoffLocation" placeholder="Dropoff Location" />
            <ErrorMessage name="dropoffLocation" component="div" />
            <Field type="number" name="currentCycleUsed" placeholder="Current Cycle Used (Hrs)" />
            <ErrorMessage name="currentCycleUsed" component="div" />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LogForm;