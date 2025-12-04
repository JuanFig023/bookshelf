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
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
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
      coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
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
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
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
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
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
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      editions: [
        { format: 'HARDCOVER', publisher: 'Scribner', year: 1925, totalCopies: 3 },
        { format: 'PAPERBACK', publisher: 'Scribner', year: 2004, totalCopies: 6 },
        { format: 'CD', publisher: 'Blackstone Audio', year: 2008, totalCopies: 1 },
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
