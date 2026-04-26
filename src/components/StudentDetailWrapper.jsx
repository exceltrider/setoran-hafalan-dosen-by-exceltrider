import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getStudentDetail } from '../lib/api';
import { StudentDetail } from './StudentDetail';
import { LoadingSpinner } from './LoadingSpinner';

export const StudentDetailWrapper = () => {
  const { nim } = useParams();
  const { refresh } = useOutletContext();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentDetail(nim);
        if (response.response) {
          setStudent(response.data.info);
        } else {
          navigate('/not-found');
        }
      } catch (err) {
        console.error(err);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [nim, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!student) return null;

  return (
    <StudentDetail
      student={student}
      onBack={() => navigate('/students')}
      onRefresh={refresh}
    />
  );
};