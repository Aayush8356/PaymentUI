import React, { useEffect, useState } from 'react';

import {
  ButtonGroup,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { AiFillEdit } from 'react-icons/ai';
import { BsBoxArrowUpRight, BsFillTrashFill } from 'react-icons/bs';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
const ContactTable = () => {
  const header = ['name', 'phone', 'actions'];
  const color1 = useColorModeValue('gray.400', 'gray.400');
  const color2 = useColorModeValue('gray.400', 'gray.400');
  const { token, isLoggedIn } = useAuth();
  const [file, setFile] = useState([]);
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate('/logout');
  }
  async function getContacts() {
    try {
      const response = await fetch(`http://localhost:5000/contact/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFile(
        data.map(key => {
          return {
            name: key.name,
            phone: key.phone,
          };
        })
      );
      console.log(data);
    } catch (error) {
      // const header = ['name', 'created', 'actions'];
      // const data = [
      //   { name: 'Daggy', created: '7 days ago' },
      //   { name: 'Anubra', created: '23 hours ago' },
      //   { name: 'Josef', created: 'A few seconds ago' },
      //   { name: 'Sage', created: 'A few hours ago' },
      // ];
      console.log(error);
    }
  }
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Flex
      w="full"
      bg="#edf3f8"
      _dark={{ bg: '#3e3e3e' }}
      p={50}
      alignItems="center"
      justifyContent="center"
    >
      <Table
        w="full"
        bg="white"
        _dark={{ bg: 'gray.800' }}
        display={{
          base: 'block',
          md: 'table',
        }}
        sx={{
          '@media print': {
            display: 'table',
          },
        }}
      >
        <Thead
          display={{
            base: 'none',
            md: 'table-header-group',
          }}
          sx={{
            '@media print': {
              display: 'table-header-group',
            },
          }}
        >
          <Tr>
            {header.map(x => (
              <Th key={x}>{x}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody
          display={{
            base: 'block',
            lg: 'table-row-group',
          }}
          sx={{
            '@media print': {
              display: 'table-row-group',
            },
          }}
        >
          {file.map((index, _id) => {
            return (
              <Tr
                key={_id}
                display={{
                  base: 'grid',
                  md: 'table-row',
                }}
                sx={{
                  '@media print': {
                    display: 'table-row',
                  },
                  gridTemplateColumns: 'minmax(0px, 35%) minmax(0px, 65%)',
                  gridGap: '10px',
                }}
              >
                {Object.keys(index).map(x => {
                  return (
                    <React.Fragment key={`${_id}${x}`}>
                      <Td
                        display={{
                          base: 'table-cell',
                          md: 'none',
                        }}
                        sx={{
                          '@media print': {
                            display: 'none',
                          },
                          textTransform: 'uppercase',
                          color: color1,
                          fontSize: 'xs',
                          fontWeight: 'bold',
                          letterSpacing: 'wider',
                          fontFamily: 'heading',
                        }}
                      >
                        {x}
                      </Td>
                      <Td
                        color={'gray.500'}
                        fontSize="md"
                        fontWeight="hairline"
                      >
                        {index[x]}
                      </Td>
                    </React.Fragment>
                  );
                })}
                <Td
                  display={{
                    base: 'table-cell',
                    md: 'none',
                  }}
                  sx={{
                    '@media print': {
                      display: 'none',
                    },
                    textTransform: 'uppercase',
                    color: color2,
                    fontSize: 'xs',
                    fontWeight: 'bold',
                    letterSpacing: 'wider',
                    fontFamily: 'heading',
                  }}
                >
                  Actions
                </Td>
                <Td>
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <IconButton
                      colorScheme="blue"
                      icon={<BsBoxArrowUpRight />}
                      aria-label="Up"
                    />
                    <IconButton
                      colorScheme="green"
                      icon={<AiFillEdit />}
                      aria-label="Edit"
                    />
                    <IconButton
                      colorScheme="red"
                      variant="outline"
                      icon={<BsFillTrashFill />}
                      aria-label="Delete"
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default ContactTable;
