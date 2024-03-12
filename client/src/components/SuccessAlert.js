import { Button, useToast } from '@chakra-ui/react';
function SuccessAlert({ col, ty }) {
  const toast = useToast();
  return (
    <Button
      onClick={() => {
        // Create an example promise that resolves in 5s
        const examplePromise = new Promise((resolve, reject) => {
          setTimeout(() => resolve(200), 5000);
        });

        // Will display the loading toast until the promise is either resolved
        // or rejected.
        toast.promise(examplePromise, {
          success: { title: 'Contact saved!', description: 'Looks great' },
          error: {
            title: 'Requested rejected',
            description: 'Something wrong',
          },
          loading: { title: 'Contact saving', description: 'Please wait' },
        });
      }}
      colorScheme={col}
      type={ty}
    >
      Save
    </Button>
  );
}

export default SuccessAlert;
