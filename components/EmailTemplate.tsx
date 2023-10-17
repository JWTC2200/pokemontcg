import * as React from 'react';
import { ContactFormData } from '@/app/types/types';


const EmailTemplate: React.FC<ContactFormData> = ({email, message}) => (
  <div>
    <p>Email: {email}</p>
    <p>{message}</p>
  </div>
);

export default EmailTemplate
