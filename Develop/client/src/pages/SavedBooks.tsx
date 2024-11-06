
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client'; // Import useMutation
import { REMOVE_BOOK } from '../graphql/mutations'; // Import your mutations
import { GET_ME } from '../graphql/queries.js';
import Auth from '../utils/auth';
import { Book } from '../models/Book.js';
import { removeBookId } from '../utils/localStorage.js';

const SavedBooks = () => {

  const [removeBook] = useMutation(REMOVE_BOOK); // Mutation to remove a book
  const {data:userData, loading} = useQuery(GET_ME);

  // Function to delete a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (!data) {
        throw new Error('something went wrong while removing the book!');
      }
      removeBookId(bookId);

      // Update userData with the updated saved books after removal
      // Remove book's id from localStorage
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.me.savedBooks?.length
            ? `Viewing ${userData.me?.savedBooks?.length??"0"} saved ${userData.me?.savedBooks?.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.me.savedBooks.map((book:Book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
