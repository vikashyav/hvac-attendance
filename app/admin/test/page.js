"use client"
import { useMutation } from '@tanstack/react-query';

export default function MyComponent() {
  const { mutateAsync } = useMutation({
    mutationFn: async (newData) => {
      // Simulate an API call
      return new Promise((resolve) => setTimeout(() => resolve(newData), 1000));
    },
  });

  const handleClick = async () => {
    try {
      const result = await mutateAsync({ name: 'New Item' },{
        onSuccess:()=>{
            alert("sucess")
        }
      });
      console.log('Mutation successful:', result);
      // Perform further actions, e.g., navigate
    } catch (error) {
      console.error('Mutation failed:', error);
      // Handle error, e.g., display an error message
    }
  };

  return <button onClick={handleClick}>Mutate Data</button>;
}