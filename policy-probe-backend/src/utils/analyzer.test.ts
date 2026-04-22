import { detectDataCategories } from './analyzer';

describe('detectDataCategories', () => {
  it('should return an empty array if no keywords are matched', () => {
    const text = 'This text has nothing to do with privacy data.';
    const categories = detectDataCategories(text);
    expect(categories).toEqual([]);
  });

  it('should detect low risk data categories (1 keyword)', () => {
    const text = 'We collect your name.';
    const categories = detectDataCategories(text);
    expect(categories).toEqual([
      {
        category: 'Personal Information',
        items: ['Name'],
        risk: 'Low',
      },
    ]);
  });

  it('should detect medium risk data categories (2-3 keywords)', () => {
    const text = 'We collect your name and email.';
    const categories = detectDataCategories(text);
    expect(categories).toEqual([
      {
        category: 'Personal Information',
        items: ['Name', 'Email'],
        risk: 'Medium',
      },
    ]);

    const text2 = 'We collect your name, email, and phone.';
    const categories2 = detectDataCategories(text2);
    expect(categories2).toEqual([
      {
        category: 'Personal Information',
        items: ['Name', 'Email', 'Phone'],
        risk: 'Medium',
      },
    ]);
  });

  it('should detect high risk data categories (>= 4 keywords)', () => {
    const text = 'We collect your name, email, phone, address, and profile data.';
    const categories = detectDataCategories(text);
    expect(categories).toEqual([
      {
        category: 'Personal Information',
        items: ['Name', 'Email', 'Phone', 'Address', 'Profile'],
        risk: 'High',
      },
    ]);
  });

  it('should detect multiple data categories correctly', () => {
    const text = 'We collect your username. We also record your IP address and operating system.';
    // 'address' is part of 'IP address', so it gets picked up as well under Personal Information.
    const categories = detectDataCategories(text);
    expect(categories).toEqual(
      expect.arrayContaining([
        {
          category: 'Personal Information',
          items: ['Name', 'Address'],
          risk: 'Medium',
        },
        {
          category: 'Device Information',
          items: ['Ip address', 'Operating system'],
          risk: 'Medium',
        },
      ])
    );
  });

  it('should be case-insensitive when detecting keywords', () => {
    const text = 'We collect your NAME and EMAIL. We also log your IP ADDRESS.';
    // 'address' is part of 'IP ADDRESS', so it also matches under Personal Information.
    const categories = detectDataCategories(text);
    expect(categories).toEqual(
      expect.arrayContaining([
        {
          category: 'Personal Information',
          items: ['Name', 'Email', 'Address'],
          risk: 'Medium',
        },
        {
          category: 'Usage Information',
          items: ['Log'],
          risk: 'Low',
        },
        {
          category: 'Device Information',
          items: ['Ip address'],
          risk: 'Low',
        },
      ])
    );
  });
});
