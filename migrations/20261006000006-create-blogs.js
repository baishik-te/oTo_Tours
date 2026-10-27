'use strict';

const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Create blogs table
      await queryInterface.createTable(
        'blogs',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
          },
          slug: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true
          },
          title: {
            type: Sequelize.STRING(255),
            allowNull: false
          },
          excerpt: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          content: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          image_url: {
            type: Sequelize.STRING(500),
            allowNull: true
          },
          category: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'Insights'
          },
          author: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'OTO Tours'
          },
          read_time: {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: '5 min read'
          },
          published_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
          },
          is_published: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          is_hidden: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          display_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          views_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          tags: {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: []
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
          }
        },
        { transaction }
      );

      await queryInterface.addIndex('blogs', ['slug'], { unique: true, transaction });
      await queryInterface.addIndex('blogs', ['is_published'], { transaction });
      await queryInterface.addIndex('blogs', ['is_hidden'], { transaction });
      await queryInterface.addIndex('blogs', ['published_at'], { transaction });
      await queryInterface.addIndex('blogs', ['category'], { transaction });

      // 2. Seed the 9 Figma blog posts
      const figmaBlogs = [
        {
          id: crypto.randomUUID(),
          slug: 'discover-minneapolis-like-a-local',
          title: 'Discover Minneapolis Like a Local.',
          excerpt: 'Explore hidden gems, scenic waterfront trails, and iconic landmarks. Uncover local stories and experiences that most visitors never get to see.',
          content: 'Minneapolis is a vibrant metropolis defined by scenic waterfronts, historic flour milling heritage, and world-class artistic culture. Navigating the city on two wheels gives you a perspective that bus tours and walking trips simply cannot match.\n\nFrom the historic Stone Arch Bridge to the tree-lined trails alongside the Mississippi River, each neighborhood holds unique architecture, local coffee spots, and storied historical sites.\n\nJoin our local storytellers as we guide you through off-the-beaten-path trails and uncover the vibrant spirit of the Twin Cities.',
          image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
          category: 'Insights',
          author: 'OTO Tours Team',
          read_time: '4 min read',
          published_at: new Date('2025-04-08T09:00:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 1,
          views_count: 320,
          tags: JSON.stringify(['Minneapolis', 'Local Guide', 'Sightseeing']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'top-attractions-you-cant-miss',
          title: "Top Attractions You Can't Miss.",
          excerpt: 'From historic districts to vibrant cultural hotspots, discover the must-see destinations that define the Twin Cities experience.',
          content: 'Whether you are visiting for a weekend getaway or living in Minnesota, Minneapolis and St. Paul boast world-class attractions that everyone should experience.\n\nHighlights include First Avenue and the iconic Prince mural, the Guthrie Theater architectural overlook, the Mill City Museum, and the expansive chain of lakes.\n\nOur guided tours connect these marquee sights with smooth, scenic transit and engaging narrative commentary.',
          image_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200',
          category: 'Twin Cities Guide',
          author: 'OTO Tours Team',
          read_time: '5 min read',
          published_at: new Date('2025-04-08T10:15:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 2,
          views_count: 275,
          tags: JSON.stringify(['Attractions', 'Culture', 'Prince Mural']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'why-segway-tours-are-the-best-way-to-explore',
          title: 'Why Segway Tours Are the Best Way to Explore.',
          excerpt: 'Cover more ground, learn fascinating local history, and enjoy a unique sightseeing adventure that’s fun for all ages.',
          content: 'Walking tours often leave you fatigued after just a couple of miles, while bus tours trap you behind tinted windows separated from the breeze and street-level atmosphere.\n\nA Segway personal transporter offers the ultimate balance: gliding smoothly at pedestrian scale, covering 5 to 8 miles in just two hours, and remaining fully engaged with your guide.\n\nEvery tour begins with comprehensive 1-on-1 rider training, ensuring you feel 100% confident before setting off.',
          image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200',
          category: 'Tour Experience',
          author: 'OTO Tours Team',
          read_time: '3 min read',
          published_at: new Date('2025-04-08T11:30:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 3,
          views_count: 410,
          tags: JSON.stringify(['Segway', 'Sightseeing', 'Adventure']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'behind-the-scenes-at-oto-tours',
          title: 'Behind the Scenes at OTO Tours.',
          excerpt: 'Meet the passionate guides behind every adventure and learn how we create memorable experiences for our guests.',
          content: 'Behind every effortless tour is a team dedicated to hospitality, safety, and storytelling excellence.\n\nBefore every tour departure, our guides inspect machines, monitor weather patterns, and customize the tour narration to suit the group’s interests—whether that is architectural deep dives or family trivia.\n\nGet to know our veteran guides and learn what inspires them to share their love of the city day after day.',
          image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200',
          category: 'Behind The Scenes',
          author: 'Michelle Rivera',
          read_time: '4 min read',
          published_at: new Date('2025-04-08T13:00:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 4,
          views_count: 195,
          tags: JSON.stringify(['Team', 'Guides', 'Hospitality']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'family-friendly-adventures-in-minneapolis',
          title: 'Family-Friendly Adventures in Minneapolis.',
          excerpt: 'Discover exciting attractions, parks, and activities that make Minneapolis the perfect destination for families and groups.',
          content: 'Traveling with teenagers or extended family? Finding activities that please everyone can be challenging. Segway tours bridge generational gaps with interactive fun, fresh air, and captivating local stories.\n\nDiscover scenic parks, riverside playgrounds, and historic locks and dams that captivate both youngsters and adults alike.\n\nHere are our top recommendations for a memorable family weekend in the Twin Cities.',
          image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200',
          category: 'Family & Groups',
          author: 'OTO Tours Team',
          read_time: '5 min read',
          published_at: new Date('2025-04-08T14:20:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 5,
          views_count: 220,
          tags: JSON.stringify(['Family', 'Parks', 'Activities']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'exploring-st-pauls-rich-history',
          title: "Exploring St. Paul's Rich History.",
          excerpt: 'Journey through centuries of history as you explore grand architecture, famous landmarks, and captivating local stories.',
          content: "St. Paul offers a distinct, historic charm with its Victorian Summit Avenue mansions, the monumental Cathedral of Saint Paul, and the magnificent Minnesota State Capitol.\n\nOur historical routes unpack tales of Gilded Age railroad barons, prohibition-era gangster hideouts, and landmark civil rights milestones.\n\nImmerse yourself in Minnesota's heritage as you roll through St. Paul's grandest boulevards.",
          image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
          category: 'Local History',
          author: 'OTO Tours Team',
          read_time: '6 min read',
          published_at: new Date('2025-04-08T15:45:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 6,
          views_count: 310,
          tags: JSON.stringify(['St. Paul', 'History', 'State Capitol']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'the-ultimate-guide-to-group-tours',
          title: 'The Ultimate Guide to Group Tours.',
          excerpt: 'Planning a corporate outing, school trip, or celebration? Learn how group tours create unforgettable shared experiences.',
          content: 'Whether celebrating a milestone birthday, hosting out-of-town colleagues, or organizing a team-building excursion, group Segway tours offer unmatched engagement.\n\nWith flexible scheduling, private route planning, and capacity for large parties, our coordinators ensure a seamless experience from booking to tour completion.\n\nExplore our planning checklist for hassle-free group events.',
          image_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200',
          category: 'Group Tours',
          author: 'Alex Smith',
          read_time: '5 min read',
          published_at: new Date('2025-04-08T16:30:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 7,
          views_count: 180,
          tags: JSON.stringify(['Group Events', 'Corporate', 'Celebrations']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'hidden-stories-behind-famous-landmarks',
          title: 'Hidden Stories Behind Famous Landmarks.',
          excerpt: 'Every landmark has a story. Discover the legends, historical moments, and surprising facts behind the city’s iconic sites.',
          content: 'Did you know the Stone Arch Bridge is the only stone bridge over the Mississippi River? Or why the Pillsbury A-Mill was once the most advanced flour mill in the world?\n\nBehind every iconic facade lies a rich tapestry of human triumph, engineering marvels, and forgotten legends.\n\nOur storytellers bring these narratives to life with archival photos and fascinating historical trivia.',
          image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
          category: 'Landmarks',
          author: 'OTO Tours Team',
          read_time: '4 min read',
          published_at: new Date('2025-04-08T17:15:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 8,
          views_count: 350,
          tags: JSON.stringify(['Landmarks', 'Legends', 'Stone Arch Bridge']),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: crypto.randomUUID(),
          slug: 'seasonal-adventures-around-the-twin-cities',
          title: 'Seasonal Adventures Around the Twin Cities.',
          excerpt: 'Experience the beauty of every season with unique tours, outdoor activities, and local events throughout the year.',
          content: 'Minnesota comes alive with dramatic beauty across spring blossoms, golden summer river breezes, and vivid autumn foliage.\n\nOur seasonal tour routes highlight the finest regional foliage along the Mississippi river gorge, festive seasonal events, and peak scenic viewpoints.\n\nLearn how each season brings a fresh new perspective to our Minneapolis and St. Paul tours.',
          image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200',
          category: 'Seasonal',
          author: 'OTO Tours Team',
          read_time: '4 min read',
          published_at: new Date('2025-04-08T18:00:00Z'),
          is_published: true,
          is_hidden: false,
          display_order: 9,
          views_count: 290,
          tags: JSON.stringify(['Seasons', 'Foliage', 'Outdoors']),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('blogs', figmaBlogs, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blogs');
  }
};
