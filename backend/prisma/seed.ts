import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.checkout.deleteMany();
  await prisma.edition.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create books with editions
  const books = [
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      description: 'A dystopian social science fiction novel and cautionary tale.',
      genre: 'Dystopian Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Penguin', year: 1961, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Signet Classic', year: 1950, totalCopies: 5 },
        { format: 'AUDIOBOOK', publisher: 'Audible', year: 2013, totalCopies: 2 },
      ],
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0547928227',
      description: 'A fantasy novel about the quest of home-loving Bilbo Baggins.',
      genre: 'Fantasy',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0618260307.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Houghton Mifflin', year: 1937, totalCopies: 4 },
        { format: 'PAPERBACK', publisher: 'Del Rey', year: 2012, totalCopies: 6 },
        { format: 'EBOOK', publisher: 'Mariner Books', year: 2012, totalCopies: 10 },
      ],
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0061120084',
      description: 'A novel about racial injustice and childhood innocence in the American South.',
      genre: 'Classic Literature',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0446310786.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'J.B. Lippincott', year: 1960, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Harper Perennial', year: 2006, totalCopies: 7 },
        { format: 'AUDIOBOOK', publisher: 'HarperAudio', year: 2014, totalCopies: 2 },
      ],
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0141439518',
      description: 'A romantic novel of manners set in Georgian England.',
      genre: 'Romance',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0553213105.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Penguin Classics', year: 2002, totalCopies: 2 },
        { format: 'PAPERBACK', publisher: 'Dover Publications', year: 1995, totalCopies: 8 },
        { format: 'EBOOK', publisher: 'AmazonClassics', year: 2017, totalCopies: 15 },
      ],
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      description: 'A novel about the American Dream in the Jazz Age.',
      genre: 'Classic Literature',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0743273567.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Scribner', year: 1925, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Scribner', year: 2004, totalCopies: 6 },
        { format: 'CD', publisher: 'Blackstone Audio', year: 2008, totalCopies: 1 },
      ],
    },
    {
      title: 'The Hunger Games',
      author: 'Suzanne Collins',
      isbn: '978-0439023481',
      description: 'A dystopian novel set in a post-apocalyptic nation where teens fight for survival.',
      genre: 'Dystopian Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0439023521.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Scholastic Press', year: 2008, totalCopies: 5 },
        { format: 'PAPERBACK', publisher: 'Scholastic', year: 2010, totalCopies: 8 },
        { format: 'AUDIOBOOK', publisher: 'Scholastic Audio', year: 2008, totalCopies: 3 },
      ],
    },
    {
      title: 'The Maze Runner',
      author: 'James Dashner',
      isbn: '978-0385737944',
      description: 'A young adult dystopian science fiction novel about a group of teens trapped in a mysterious maze.',
      genre: 'Dystopian Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0385737955.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Delacorte Press', year: 2009, totalCopies: 4 },
        { format: 'PAPERBACK', publisher: 'Delacorte Press', year: 2011, totalCopies: 7 },
        { format: 'EBOOK', publisher: 'Delacorte Press', year: 2013, totalCopies: 12 },
      ],
    },
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      isbn: '978-0439708180',
      description: 'A young wizard begins his magical education at Hogwarts School of Witchcraft and Wizardry.',
      genre: 'Fantasy',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0590353403.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Scholastic', year: 1998, totalCopies: 6 },
        { format: 'PAPERBACK', publisher: 'Scholastic', year: 1999, totalCopies: 10 },
        { format: 'AUDIOBOOK', publisher: 'Pottermore', year: 2015, totalCopies: 4 },
      ],
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '978-0316769174',
      description: 'A coming-of-age story following a teenage boy in New York City.',
      genre: 'Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0316769177.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Little, Brown', year: 1951, totalCopies: 2 },
        { format: 'PAPERBACK', publisher: 'Back Bay Books', year: 2001, totalCopies: 6 },
        { format: 'AUDIOBOOK', publisher: 'Hachette Audio', year: 2008, totalCopies: 2 },
      ],
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      isbn: '978-0544003415',
      description: 'An epic high fantasy trilogy following the quest to destroy a powerful ring.',
      genre: 'Fantasy',
      coverImage: 'https://pics.cdn.librarything.com/picsizes/88/49/8849999-b-h400-w0-pv25_596b384b68774141414a4142_v5.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Houghton Mifflin', year: 1954, totalCopies: 5 },
        { format: 'PAPERBACK', publisher: 'Del Rey', year: 1986, totalCopies: 8 },
        { format: 'EBOOK', publisher: 'Mariner Books', year: 2012, totalCopies: 15 },
      ],
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      isbn: '978-0060850524',
      description: 'A dystopian novel exploring a futuristic society built on technological advancement and control.',
      genre: 'Dystopian Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0060929871.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Chatto & Windus', year: 1932, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Harper Perennial', year: 2006, totalCopies: 5 },
        { format: 'AUDIOBOOK', publisher: 'Blackstone Audio', year: 2010, totalCopies: 2 },
      ],
    },
    {
      title: 'The Chronicles of Narnia',
      author: 'C.S. Lewis',
      isbn: '978-0066238500',
      description: 'A series of fantasy novels set in the magical land of Narnia.',
      genre: 'Fantasy',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0066238501.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'HarperCollins', year: 1950, totalCopies: 4 },
        { format: 'PAPERBACK', publisher: 'HarperCollins', year: 2001, totalCopies: 7 },
        { format: 'AUDIOBOOK', publisher: 'HarperAudio', year: 1999, totalCopies: 3 },
      ],
    },
    {
      title: 'Jane Eyre',
      author: 'Charlotte Brontë',
      isbn: '978-0141441146',
      description: 'A classic novel following an orphaned girl\'s journey to independence and love.',
      genre: 'Romance',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0142437204.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Penguin Classics', year: 2006, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Dover Publications', year: 2002, totalCopies: 6 },
        { format: 'EBOOK', publisher: 'AmazonClassics', year: 2017, totalCopies: 10 },
      ],
    },
    {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      isbn: '978-1451673319',
      description: 'A dystopian novel about a future society where books are banned and burned.',
      genre: 'Dystopian Fiction',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0345342968.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Ballantine Books', year: 1953, totalCopies: 4 },
        { format: 'PAPERBACK', publisher: 'Simon & Schuster', year: 2013, totalCopies: 6 },
        { format: 'AUDIOBOOK', publisher: 'Audible', year: 2010, totalCopies: 2 },
      ],
    },
    {
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      isbn: '978-0141439556',
      description: 'A gothic romance novel set on the Yorkshire moors.',
      genre: 'Classic Literature',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0141439556.01._SX900_SY1270_SCLZZZZZZZ_.jpg',
      editions: [
        { format: 'HARDCOVER', publisher: 'Penguin Classics', year: 2003, totalCopies: 2 },
        { format: 'PAPERBACK', publisher: 'Dover Publications', year: 1996, totalCopies: 5 },
        { format: 'AUDIOBOOK', publisher: 'Naxos AudioBooks', year: 2009, totalCopies: 2 },
      ],
    },
  ];

  for (const bookData of books) {
    const { editions, ...bookInfo } = bookData;
    const book = await prisma.book.create({
      data: {
        ...bookInfo,
        editions: {
          create: editions,
        },
      },
      include: {
        editions: true,
      },
    });
    console.log(`✅ Created book: ${book.title} with ${book.editions.length} editions`);
  }

  // Create a test user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.create({
    data: {
      email: 'test@library.com',
      name: 'Test User',
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });
  console.log(`✅ Created test user: ${testUser.email}`);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@library.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);

  console.log('🎉 Seed completed!');
  console.log(`📚 Total books: ${books.length}`);
  console.log(`📖 Total editions: ${books.reduce((acc, b) => acc + b.editions.length, 0)}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
