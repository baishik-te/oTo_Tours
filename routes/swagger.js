const swaggerJSDoc = require('swagger-jsdoc');
const config = require('../config/app');

const port = process.env.PORT || config.port || 5050;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'oTo Tours API',
    version: '1.0.0',
    description: 'Comprehensive REST API documentation for oTo Tours. Centralized OpenAPI specification including public browsing endpoints and administrative management for tours, categories, and locations.',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local Development Server',
    },
  ],
  tags: [
    { name: 'General', description: 'System health & caller identity endpoints' },
    { name: 'Tours', description: 'Public Tour browsing, details, and metadata' },
    { name: 'Locations', description: 'Public Tour Locations browsing, landing page metadata, and destination details strictly from Figma' },
    { name: 'Admin Tours', description: 'Admin Tour CRUD operations (Requires API Key)' },
    { name: 'Admin Categories', description: 'Admin Category CRUD & Cascading management (Requires API Key)' },
    { name: 'Admin Locations', description: 'Admin Location CRUD & Destination management (Requires API Key)' },
    { name: 'Admin', description: 'Admin authentication and privilege verification' },
    { name: 'Events', description: 'Public Events discovery, page metadata, photo gallery, and quote inquiries' },
    { name: 'Admin Events', description: 'Admin Event Types & Inquiry management (Requires API Key)' },
    { name: 'Contact & About', description: 'Public Contact Us, About Us story narrative, and contact message submissions' },
    { name: 'Admin Content', description: 'Admin management of received contact messages, contact info, about page content, and locations page CMS' },
    { name: 'Authentication & OTP', description: 'User registration as guest, SMTP OTP verification, login, and JWT tokens' },
    { name: 'Homepage', description: 'Public final homepage APIs with all 14 visual sections from Figma' },
    { name: 'Admin Homepage CMS', description: 'Admin CMS management for dynamic homepage sections' },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-api-key',
        description: 'Admin API Key (Default: oto_admin_secret_key_2026)',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token obtained from /api/auth/login or /api/auth/register'
      },
    },
    schemas: {
      LocationCard: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'ff513c6a-0a6d-4317-b73f-1a7a8f7a24fd' },
          locationCode: { type: 'string', example: 'boston-ma' },
          name: { type: 'string', example: 'Boston, MA' },
          city: { type: 'string', example: 'Boston' },
          state: { type: 'string', example: 'MA' },
          country: { type: 'string', example: 'USA' },
          description: { type: 'string', example: 'Historic sites, iconic landmarks, and waterfront views.' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200' },
          isFeatured: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          latitude: { type: 'number', example: 42.3601 },
          longitude: { type: 'number', example: -71.0589 },
          bookingUrl: { type: 'string', example: '/tours?location=Boston' },
          toursCount: { type: 'integer', example: 2 }
        }
      },
      LocationCreateInput: {
        type: 'object',
        required: ['name', 'city', 'state'],
        properties: {
          name: { type: 'string', example: 'Boston, MA' },
          city: { type: 'string', example: 'Boston' },
          state: { type: 'string', example: 'MA' },
          locationCode: { type: 'string', example: 'boston-ma', description: 'Auto-generated from city-state if omitted' },
          country: { type: 'string', example: 'USA' },
          description: { type: 'string', example: 'Historic sites, iconic landmarks, and waterfront views.' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200' },
          isFeatured: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          latitude: { type: 'number', example: 42.3601 },
          longitude: { type: 'number', example: -71.0589 }
        }
      },
      LocationUpdateInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Boston Historic District' },
          city: { type: 'string', example: 'Boston' },
          state: { type: 'string', example: 'MA' },
          locationCode: { type: 'string', example: 'boston-ma' },
          country: { type: 'string', example: 'USA' },
          description: { type: 'string', example: 'Historic sites, iconic landmarks, and waterfront views.' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200' },
          isFeatured: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          latitude: { type: 'number', example: 42.3601 },
          longitude: { type: 'number', example: -71.0589 }
        }
      },
      HealthCheck: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          service: { type: 'string', example: 'oTo Tours API' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-10-05T10:30:00.000Z' },
        },
      },
      TourPricing: {
        type: 'object',
        properties: {
          startingFrom: { type: 'number', example: 89.0 },
          currency: { type: 'string', example: 'USD' },
          currencySymbol: { type: 'string', example: '$' },
          unit: { type: 'string', example: 'per person' },
          displayLabel: { type: 'string', example: 'From, $89 / person' },
        },
      },
      TourLocation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'd4e5f6a7-b8c9-0123-defa-234567890123' },
          locationCode: { type: 'string', example: 'downtown-minneapolis' },
          name: { type: 'string', example: 'Downtown Minneapolis' },
          city: { type: 'string', example: 'Minneapolis' },
          state: { type: 'string', example: 'Minnesota' },
          country: { type: 'string', example: 'USA' },
          latitude: { type: 'number', example: 44.9778 },
          longitude: { type: 'number', example: -93.2650 },
          sequence: { type: 'integer', example: 1 },
          isPrimary: { type: 'boolean', example: true },
        },
      },
      Tour: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          tourCode: { type: 'string', example: 'st-paul-legacy-tour', description: 'Human-readable identifier' },
          slug: { type: 'string', example: 'st-paul-legacy-tour' },
          title: { type: 'string', example: 'St. Paul Legacy Tour' },
          categoryId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', description: 'UUID of the associated category' },
          category: { type: 'string', example: 'e-Bike tours' },
          categoryCode: { type: 'string', example: 'ebike' },
          categoryTag: { type: 'string', example: 'E-Bike' },
          badge: { type: 'string', example: 'E-Bike' },
          duration: { type: 'string', example: '2.5 Hours' },
          durationMinutes: { type: 'integer', example: 150 },
          location: { type: 'string', example: 'St. Paul, MN' },
          city: { type: 'string', example: 'St. Paul' },
          state: { type: 'string', example: 'Minnesota' },
          country: { type: 'string', example: 'USA' },
          locations: {
            type: 'array',
            items: { $ref: '#/components/schemas/TourLocation' },
          },
          primaryLocation: { $ref: '#/components/schemas/TourLocation' },
          isSignature: { type: 'boolean', example: true },
          shortDescription: { type: 'string', example: 'Journey through historic streets and grand architecture.' },
          pricing: { $ref: '#/components/schemas/TourPricing' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7?auto=format&fit=crop&w=800&q=80' },
        },
      },
      TourCreateInput: {
        type: 'object',
        required: ['title', 'categoryId', 'duration'],
        properties: {
          title: { type: 'string', example: 'Minneapolis Riverfront Historic Segway Tour' },
          tourCode: { type: 'string', example: 'minneapolis-riverfront-tour', description: 'Optional human-readable code; auto-generated from title if omitted' },
          categoryId: { type: 'string', example: 'segway', description: 'Category UUID or category_code (e.g. "segway")' },
          badge: { type: 'string', example: 'Segway' },
          duration: { type: 'string', example: '3 Hours' },
          durationMinutes: { type: 'integer', example: 180 },
          locations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                locationCode: { type: 'string', example: 'downtown-minneapolis' },
                sequence: { type: 'integer', example: 1 },
                isPrimary: { type: 'boolean', example: true },
              },
            },
          },
          location: { type: 'string', example: 'Downtown Minneapolis' },
          isSignature: { type: 'boolean', example: false },
          shortDescription: { type: 'string', example: 'Glide through downtown Minneapolis along the Mississippi riverfront.' },
          pricing: {
            type: 'object',
            properties: {
              startingFrom: { type: 'number', example: 105.0 },
              currency: { type: 'string', example: 'USD' },
              currencySymbol: { type: 'string', example: '$' },
              unit: { type: 'string', example: 'per person' },
            },
          },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
        },
      },
      TourUpdateInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Tour Title' },
          categoryId: { type: 'string', example: 'segway' },
          duration: { type: 'string', example: '2.5 Hours' },
          locations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                locationCode: { type: 'string', example: 'downtown-minneapolis' },
                sequence: { type: 'integer', example: 1 },
                isPrimary: { type: 'boolean', example: true },
              },
            },
          },
          shortDescription: { type: 'string', example: 'Updated tour details and highlights.' },
          pricing: {
            type: 'object',
            properties: {
              startingFrom: { type: 'number', example: 95.0 },
            },
          },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7?auto=format&fit=crop&w=800&q=80' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
          categoryCode: { type: 'string', example: 'ebike', description: 'Human-readable identifier (previously the id)' },
          name: { type: 'string', example: 'e-Bike tours' },
          badge: { type: 'string', example: 'E-Bike' },
          tourCount: { type: 'integer', example: 2 },
        },
      },
      CategoryCreateInput: {
        type: 'object',
        required: ['name'],
        properties: {
          categoryCode: { type: 'string', example: 'helicopter', description: 'Optional human-readable code; auto-generated from name if omitted' },
          name: { type: 'string', example: 'Helicopter Tours' },
          badge: { type: 'string', example: 'Aerial' },
        },
      },
      CategoryUpdateInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Updated Category Name' },
          badge: { type: 'string', example: 'Updated Badge' },
        },
      },
      Location: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
          locationCode: { type: 'string', example: 'downtown-minneapolis', description: 'Human-readable identifier (previously the id)' },
          name: { type: 'string', example: 'Downtown Minneapolis' },
          city: { type: 'string', example: 'Minneapolis' },
          state: { type: 'string', example: 'Minnesota' },
          country: { type: 'string', example: 'USA' },
          latitude: { type: 'number', example: 44.9778 },
          longitude: { type: 'number', example: -93.2650 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Error message description' },
              statusCode: { type: 'integer', example: 400 },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string', example: 'title' },
                    message: { type: 'string', example: 'Title is required' },
                  },
                },
              },
            },
          },
        },
      },
      EventType: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'e4a781b2-c3d4-4e5f-a6b7-c8d9e0f1a2b3' },
          eventCode: { type: 'string', example: 'corporate-event' },
          title: { type: 'string', example: 'Corporate Event' },
          slug: { type: 'string', example: 'corporate-event' },
          tagline: { type: 'string', example: 'Team building and executive entertainment' },
          description: { type: 'string', example: 'Elevate team dynamics and impress clients with an immersive guided city tour.' },
          subOfferings: {
            type: 'array',
            items: { type: 'string' },
            example: ['Team Building', 'Client Entertainment', 'Company Outing']
          },
          features: {
            type: 'array',
            items: { type: 'string' },
            example: ['Up to 80+ Riders Accommodated', 'Dedicated Event coordinator', 'Safety First Approach']
          },
          maxRidersCapacity: { type: 'integer', example: 80 },
          coverImage: { type: 'string', example: 'https://images.unsplash.com/photo-1511578314322-379afb476865' },
          galleryImages: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c']
          },
          displayOrder: { type: 'integer', example: 1 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      EventInquiry: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'f5b892c3-d4e5-4f6a-b7c8-d9e0f1a2b3c4' },
          inquiryCode: { type: 'string', example: 'EVT-2026-9B4F1A' },
          eventTypeName: { type: 'string', example: 'Corporate Event' },
          contactName: { type: 'string', example: 'Alex Smith' },
          email: { type: 'string', format: 'email', example: 'alex.smith@acme.corp' },
          phone: { type: 'string', example: '612-555-0199' },
          organizationName: { type: 'string', example: 'Acme Technologies' },
          estimatedRiders: { type: 'integer', example: 25 },
          preferredDate: { type: 'string', format: 'date', example: '2026-11-20' },
          alternateDate: { type: 'string', format: 'date', example: '2026-11-25' },
          preferredTimeSlot: { type: 'string', example: 'Afternoon (2:00 PM)' },
          selectedHighlights: {
            type: 'array',
            items: { type: 'string' },
            example: ['Team Building', 'Custom tour routes']
          },
          locationPreference: { type: 'string', example: 'Downtown Riverfront' },
          specialRequests: { type: 'string', example: 'Vegetarian snacks requested' },
          status: { type: 'string', enum: ['pending', 'under_review', 'quoted', 'confirmed', 'completed', 'cancelled'], example: 'pending' },
          quoteAmount: { type: 'number', example: 1850.00 },
          internalNotes: { type: 'string', example: 'Applied 10% group discount' }
        }
      },
      InquiryInput: {
        type: 'object',
        required: ['contactName', 'email', 'phone', 'preferredDate'],
        properties: {
          eventCode: { type: 'string', example: 'corporate-event' },
          contactName: { type: 'string', example: 'Alex Smith' },
          email: { type: 'string', format: 'email', example: 'alex.smith@acme.corp' },
          phone: { type: 'string', example: '612-555-0199' },
          organizationName: { type: 'string', example: 'Acme Technologies' },
          estimatedRiders: { type: 'integer', example: 25 },
          preferredDate: { type: 'string', format: 'date', example: '2026-11-20' },
          alternateDate: { type: 'string', format: 'date', example: '2026-11-25' },
          preferredTimeSlot: { type: 'string', example: 'Afternoon (2:00 PM)' },
          selectedHighlights: {
            type: 'array',
            items: { type: 'string' },
            example: ['Team Building']
          },
          locationPreference: { type: 'string', example: 'Downtown Riverfront' },
          specialRequests: { type: 'string', example: 'Vegetarian snacks requested' }
        }
      },

      ContactInfo: {
        type: 'object',
        properties: {
          hero: {
            type: 'object',
            properties: {
              badge: { type: 'string', example: 'CONTACT' },
              title: { type: 'string', example: 'CONTACT US' },
              heroImage: { type: 'string', example: 'https://images.unsplash.com/...' }
            }
          },
          getInTouch: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'GET IN TOUCH' },
              subtitle: { type: 'string', example: 'Have questions or Need assistance? Reach out to our team - We are happy to help' },
              email: { type: 'string', example: 'michelle.rivera@example.com' },
              phone: { type: 'string', example: '(319) 555-0115' },
              address: { type: 'string', example: '3517 W. Gray St. Utica, Pennsylvania 57867' },
              businessHours: { type: 'string', example: 'Open 24 Hours' }
            }
          },
          formSubjects: {
            type: 'array',
            items: { type: 'string' },
            example: ['General Inquiry', 'Tour Booking & Reservation', 'Private Events & Group Tours']
          },
          mapLocation: {
            type: 'object',
            properties: {
              locationName: { type: 'string', example: 'OTO Tours' },
              address: { type: 'string', example: '3517 W. Gray St. Utica, Pennsylvania 57867' },
              city: { type: 'string', example: 'Utica' },
              state: { type: 'string', example: 'Pennsylvania' },
              postalCode: { type: 'string', example: '57867' },
              latitude: { type: 'number', example: 40.6300 },
              longitude: { type: 'number', example: -73.9700 }
            }
          }
        }
      },
      ContactMessageInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phone', 'subject', 'message'],
        properties: {
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '(319) 555-9876' },
          subject: { type: 'string', example: 'Tour Booking & Reservation' },
          message: { type: 'string', example: 'Interested in booking a weekend morning tour for 4 people.' }
        }
      },
      ContactMessage: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          referenceCode: { type: 'string', example: 'MSG-2026-F9A1B2' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '(319) 555-9876' },
          subject: { type: 'string', example: 'Tour Booking & Reservation' },
          message: { type: 'string', example: 'Interested in booking a weekend morning tour for 4 people.' },
          status: { type: 'string', enum: ['new', 'in_progress', 'responded', 'archived'], example: 'new' },
          internalNotes: { type: 'string', example: 'Customer called back and requested 10:00 AM Segway tour.' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-06T14:20:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-10-06T14:25:00.000Z' }
        }
      },
      ContactMessageStatusUpdate: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['new', 'in_progress', 'responded', 'archived'],
            example: 'in_progress',
            description: 'New workflow status for the contact message'
          },
          internalNotes: {
            type: 'string',
            example: 'Replied to customer via email with weekend availability.',
            description: 'Internal coordinator notes and follow-up records'
          }
        }
      },
      AboutStory: {
        type: 'object',
        properties: {
          hero: {
            type: 'object',
            properties: {
              badge: { type: 'string', example: 'ABOUT US' },
              title: { type: 'string', example: 'OUR STORY' },
              heroImage: { type: 'string', example: 'https://images.unsplash.com/...' }
            }
          },
          story: {
            type: 'object',
            properties: {
              headline: { type: 'string', example: 'LOCAL ROOTS. UNFORGETTABLE EXPERIENCES.' },
              paragraphs: {
                type: 'array',
                items: { type: 'string' },
                example: [
                  'OTO Tours was founded with a simple idea: combine the thrill of riding a Segway with the power of storytelling.',
                  'What started as a small team of passionate locals has grown into one of the most trusted names in guided city tours.',
                  'We take pride in showcasing the real stories, hidden gems, and iconic landmarks that make each city unique.'
                ]
              },
              cta: {
                type: 'object',
                properties: {
                  label: { type: 'string', example: 'MEET OUR TEAM' },
                  action: { type: 'string', example: 'view_team' }
                }
              },
              storefrontImage: { type: 'string', example: 'https://images.unsplash.com/...' },
              teamPhoto: { type: 'string', example: 'https://images.unsplash.com/...' }
            }
          }
        }
      },

      Blog: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          slug: { type: 'string', example: 'discover-minneapolis-like-a-local' },
          title: { type: 'string', example: 'Discover Minneapolis Like a Local.' },
          excerpt: { type: 'string', example: 'Explore hidden gems, scenic waterfront trails, and iconic landmarks. Uncover local stories and experiences that most visitors never get to see.' },
          content: { type: 'string', example: 'Minneapolis is a vibrant metropolis defined by scenic waterfronts...' },
          details: { type: 'string', example: 'Minneapolis is a vibrant metropolis defined by scenic waterfronts...' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200' },
          category: { type: 'string', example: 'Insights' },
          author: { type: 'string', example: 'OTO Tours Team' },
          readTime: { type: 'string', example: '4 min read' },
          publishedAt: { type: 'string', format: 'date-time', example: '2025-04-08T09:00:00.000Z' },
          date: { type: 'string', example: 'APRIL 8, 2025' },
          time: { type: 'string', example: '09:00 AM' },
          formattedDate: { type: 'string', example: 'APRIL 8, 2025' },
          formattedTime: { type: 'string', example: '09:00 AM' },
          isPublished: { type: 'boolean', example: true },
          isHidden: { type: 'boolean', example: false },
          displayOrder: { type: 'integer', example: 1 },
          viewsCount: { type: 'integer', example: 320 },
          tags: { type: 'array', items: { type: 'string' }, example: ['Minneapolis', 'Local Guide'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      BlogInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Discover Minneapolis Like a Local.' },
          slug: { type: 'string', example: 'discover-minneapolis-like-a-local' },
          excerpt: { type: 'string', example: 'Explore hidden gems, scenic waterfront trails, and iconic landmarks.' },
          content: { type: 'string', example: 'Full article body and storytelling details...' },
          details: { type: 'string', example: 'Full article body and storytelling details...' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200' },
          category: { type: 'string', example: 'Insights' },
          author: { type: 'string', example: 'OTO Tours Team' },
          readTime: { type: 'string', example: '4 min read' },
          publishedAt: { type: 'string', format: 'date-time', example: '2025-04-08T09:00:00.000Z' },
          isPublished: { type: 'boolean', example: true },
          isHidden: { type: 'boolean', example: false },
          displayOrder: { type: 'integer', example: 1 },
          tags: { type: 'array', items: { type: 'string' }, example: ['Minneapolis', 'Sightseeing'] }
        }
      },
      BlogVisibilityInput: {
        type: 'object',
        properties: {
          isHidden: { type: 'boolean', example: true, description: 'Set true to hide blog from public view; set false to publish' },
          hide: { type: 'boolean', example: true, description: 'Alias for isHidden' }
        }
      },
      UserRegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Sarah Connor', description: 'Full name of user' },
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com', description: 'Unique user email address' },
          password: { type: 'string', format: 'password', example: 'SecurePassword123!', description: 'Plaintext password (hashed with bcrypt)' },
          phone: { type: 'string', example: '555-0199', description: 'Optional contact phone number' }
        }
      },
      UserLoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
          password: { type: 'string', format: 'password', example: 'SecurePassword123!' }
        }
      },
      VerifyOtpInput: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
          otp: { type: 'string', example: '123456', description: '6-digit OTP code sent to user email via SMTP' },
          otpCode: { type: 'string', example: '123456', description: 'Alternative alias parameter for otp' }
        }
      },
      ResendOtpInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' }
        }
      },
      TokenIssueInput: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'usr_dev_123' },
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
          name: { type: 'string', example: 'Sarah Connor' },
          role: { type: 'string', enum: ['guest', 'user', 'admin'], example: 'user' },
          status: { type: 'string', enum: ['active', 'inactive'], example: 'active' }
        }
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c7b2d5e1-8f3a-4c91-a64d-9102b5e20173' },
          name: { type: 'string', example: 'Sarah Connor' },
          email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
          phone: { type: 'string', example: '555-0199' },
          role: { type: 'string', enum: ['guest', 'user', 'admin'], example: 'guest' },
          status: { type: 'string', enum: ['active', 'inactive'], example: 'inactive' },
          emailVerified: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'User registered as guest. Please verify the OTP sent to your email to activate your account.' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMCIsImVtYWlsIjoic2FyYWgiLCJyb2xlIjoiZ3Vlc3QiLCJzdGF0dXMiOiJpbmFjdGl2ZSJ9...' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/UserProfile' },
              role: { type: 'string', enum: ['guest', 'user', 'admin'], example: 'guest' },
              status: { type: 'string', enum: ['active', 'inactive'], example: 'inactive' },
              emailVerified: { type: 'boolean', example: false }
            }
          }
        }
      },
      SessionMeResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['guest', 'user', 'admin'], example: 'user' },
              status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
              authenticated: { type: 'boolean', example: true },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'c7b2d5e1-8f3a-4c91-a64d-9102b5e20173' },
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
                  name: { type: 'string', example: 'Sarah Connor' },
                  role: { type: 'string', example: 'user' },
                  status: { type: 'string', example: 'active' }
                }
              },
              permissions: {
                type: 'array',
                items: { type: 'string' },
                example: ['view:tours', 'view:categories', 'view:events', 'submit:inquiries', 'book:tours', 'view:profile']
              }
            }
          }
        }
      },
      HomeHeroData: {
        type: 'object',
        properties: {
          badge: { type: 'string', example: 'RATED #1 CITY TOUR EXPERIENCE' },
          headline: { type: 'string', example: 'RIDE THE FUTURE, EXPERIENCE THE CITY' },
          subheadline: { type: 'string', example: 'Guided Segway & electric fleet adventures giving you unmatched access to city skyline and waterfront views.' },
          ctaPrimary: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Book Tours' },
              url: { type: 'string', example: '/tours' }
            }
          },
          ctaSecondary: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Explore Fleet' },
              url: { type: 'string', example: '#fleet' }
            }
          },
          backgroundUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600' }
        }
      },
      HomeExperiencesData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'EXPLORE EXPERIENCES' },
          subtitle: { type: 'string', example: 'Discover our top curated tours tailored to your style and pace.' },
          categoryTabs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', example: 'all' },
                label: { type: 'string', example: 'All' },
                badge: { type: 'string', example: 'Featured' },
                count: { type: 'integer', example: 12 }
              }
            }
          },
          tours: {
            type: 'array',
            items: { $ref: '#/components/schemas/Tour' }
          }
        }
      },
      HomeFeaturedToursData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'UNFORGETTABLE TRAVEL EXPERIENCES' },
          subtitle: { type: 'string', example: 'Hand-picked premier guided tours offering thrilling views and rich history.' },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'View All Tours' },
              url: { type: 'string', example: '/tours' }
            }
          },
          tours: {
            type: 'array',
            items: { $ref: '#/components/schemas/Tour' }
          }
        }
      },
      HomeStatsData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'SAFETY FIRST. EXPERIENCE ALWAYS.' },
          description: { type: 'string', example: 'Every tour starts with a one-on-one orientation and hands-on practice session. We provide top-of-the-line helmets and certified safety equipment.' },
          metrics: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'string', example: '50k+' },
                label: { type: 'string', example: 'Happy Riders' },
                key: { type: 'string', example: 'riders' }
              }
            }
          }
        }
      },
      HomeTestimonialData: {
        type: 'object',
        properties: {
          quote: { type: 'string', example: 'The perfect way to learn an incredible city afternoon' },
          author: { type: 'string', example: 'MICHELLE R.' },
          designation: { type: 'string', example: 'Verified Rider, Chicago Riverfront Tour' },
          rating: { type: 'number', example: 5.0 }
        }
      },
      HomeStoryData: {
        type: 'object',
        properties: {
          badge: { type: 'string', example: 'SINCE 2003' },
          title: { type: 'string', example: '23 YEARS OF CREATING UNFORGETTABLE EXPERIENCES' },
          description: { type: 'string', example: "Since 2003, OTO Tours has guided travelers, locals, and corporate teams through America's most dynamic streets and historical landmarks." },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Learn More' },
              url: { type: 'string', example: '/about' }
            }
          },
          teamImageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600' },
          foundedYear: { type: 'integer', example: 2003 }
        }
      },
      HomeUsaCraftData: {
        type: 'object',
        properties: {
          badge: { type: 'string', example: 'MADE IN USA' },
          title: { type: 'string', example: 'DESIGNED, ENGINEERED & BUILT IN THE USA' },
          description: { type: 'string', example: 'Our vehicles are custom engineered for maximum rider comfort, intuitive balance, and zero emissions in urban environments.' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200' }
        }
      },
      HomeGearProduct: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'gear-1' },
          name: { type: 'string', example: 'OTO Classic Tour Tee' },
          price: { type: 'number', example: 25.00 },
          currency: { type: 'string', example: 'USD' },
          currencySymbol: { type: 'string', example: '$' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600' },
          category: { type: 'string', example: 'Apparel' }
        }
      },
      HomeGearData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'GEAR UP FOR YOUR ADVENTURE' },
          subtitle: { type: 'string', example: 'Official OTO Tours merchandise, travel essentials, and safety apparel.' },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Shop All Gear' },
              url: { type: 'string', example: '/shop' }
            }
          },
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/HomeGearProduct' }
          }
        }
      },
      HomeLicenseProgramData: {
        type: 'object',
        properties: {
          badge: { type: 'string', example: 'CERTIFIED RIDER' },
          title: { type: 'string', example: "WHY DRIVER'S LICENSE PROGRAM" },
          description: { type: 'string', example: 'Complete our quick 15-minute training during any guided tour to earn your official OTO Tours Certified Rider License. Unlock discounted rentals and self-guided exploration across all our locations.' },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'Learn More' },
              url: { type: 'string', example: '/programs/license' }
            }
          },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200' }
        }
      },
      HomeVehicleHotspot: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'hotspot-1' },
          title: { type: 'string', example: 'Smart LeanSteer™ Handlebar' },
          description: { type: 'string', example: 'Intuitive steering that reacts dynamically to subtle shifts in your center of gravity.' },
          position: { type: 'string', example: 'top' }
        }
      },
      HomeVehicleSpecsData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'INSIDE THE OTO TOURS SEGWAY' },
          subtitle: { type: 'string', example: 'Aerospace-grade gyroscopic stability and dual-redundant safety engineering.' },
          vehicleModel: { type: 'string', example: 'Segway i2 SE Urban Transporter' },
          vehicleImageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200' },
          hotspots: {
            type: 'array',
            items: { $ref: '#/components/schemas/HomeVehicleHotspot' }
          }
        }
      },
      HomeBlogsData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'RECENT BLOG POSTS' },
          subtitle: { type: 'string', example: 'Latest insights, rider tips, and local landmark stories from our veteran guides.' },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string', example: 'View All Posts' },
              url: { type: 'string', example: '/blogs' }
            }
          },
          blogs: {
            type: 'array',
            items: { $ref: '#/components/schemas/Blog' }
          }
        }
      },
      HomeSocialPhoto: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'social-1' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600' },
          caption: { type: 'string', example: 'Rolling into sunset along the waterfront' }
        }
      },
      HomeSocialFeedData: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'FOLLOW US @OTO_TOURS' },
          handle: { type: 'string', example: '@oto_tours' },
          instagramUrl: { type: 'string', example: 'https://instagram.com/oto_tours' },
          photos: {
            type: 'array',
            items: { $ref: '#/components/schemas/HomeSocialPhoto' }
          }
        }
      },
      NewsletterInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'rider@example.com' }
        }
      },
      HomeFooterData: {
        type: 'object',
        properties: {
          contact: {
            type: 'object',
            properties: {
              phone: { type: 'string', example: '+1 (800) 555-0199' },
              email: { type: 'string', format: 'email', example: 'info@ototours.com' },
              address: { type: 'string', example: '123 Riverfront Esplanade, Chicago, IL 60601' },
              hours: { type: 'string', example: 'Mon - Sun: 8:00 AM - 8:00 PM CST' }
            }
          },
          links: {
            type: 'object',
            properties: {
              places: { type: 'array', items: { type: 'string' }, example: ['Chicago', 'Utica', 'Boston', 'Twin Cities', 'Denver', 'Austin'] },
              services: { type: 'array', items: { type: 'string' }, example: ['Segway Tours', 'E-Bike Rentals', 'Private Events', 'Official Gear'] },
              info: { type: 'array', items: { type: 'string' }, example: ['Our Story', 'Safety Briefing', 'Driver License Program', 'Recent Blogs', 'Careers'] }
            }
          },
          copyright: { type: 'string', example: '© 2026 oTo Tours. All rights reserved.' }
        }
      },
      HomeOverviewResponse: {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'oTo Tours' },
              tagline: { type: 'string', example: 'Ride The Future, Experience The City' },
              logoText: { type: 'string', example: 'oTo TOURS' }
            }
          },
          hero: { $ref: '#/components/schemas/HomeHeroData' },
          experiences: { $ref: '#/components/schemas/HomeExperiencesData' },
          featuredExperiences: { $ref: '#/components/schemas/HomeFeaturedToursData' },
          testimonial: { $ref: '#/components/schemas/HomeTestimonialData' },
          stats: { $ref: '#/components/schemas/HomeStatsData' },
          story: { $ref: '#/components/schemas/HomeStoryData' },
          usaCraft: { $ref: '#/components/schemas/HomeUsaCraftData' },
          gear: { $ref: '#/components/schemas/HomeGearData' },
          licenseProgram: { $ref: '#/components/schemas/HomeLicenseProgramData' },
          vehicleSpecs: { $ref: '#/components/schemas/HomeVehicleSpecsData' },
          recentBlogs: { $ref: '#/components/schemas/HomeBlogsData' },
          socialFeed: { $ref: '#/components/schemas/HomeSocialFeedData' },
          footer: { $ref: '#/components/schemas/HomeFooterData' }
        }
      },
      AdminHomeSectionUpdateInput: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'object',
            description: 'Updated section JSON configuration data'
          }
        }
      },
      AdminHomeBulkUpdateInput: {
        type: 'object',
        description: 'Key-value map of section keys to section configuration objects',
        example: {
          homepage_hero: {
            badge: 'RATED #1 CITY TOUR EXPERIENCE',
            headline: 'UPDATED HERO TITLE',
            subheadline: 'Fresh experience copy...'
          }
        }
      }
    },
  },
  paths: {
    // ==========================================
    // GENERAL ENDPOINTS
    // ==========================================
    '/api/health': {
      get: {
        summary: 'API health and status check',
        description: 'Returns the operational status and timestamp of the oTo Tours API.',
        tags: ['General'],
        responses: {
          200: {
            description: 'Service is healthy and operational',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthCheck' },
              },
            },
          },
        },
      },
    },
    '/api/me': {
      get: {
        summary: 'Get caller session and role info',
        description: 'Returns caller profile, authentication status, and permission scopes. Supports Authorization Bearer JWT (guest, user, or admin), x-admin-api-key, or x-user-token. Unauthenticated requests resolve as guest.',
        tags: ['General', 'Authentication & OTP'],
        security: [
          {},
          { BearerAuth: [] },
          { ApiKeyAuth: [] }
        ],
        parameters: [
          {
            in: 'header',
            name: 'x-admin-api-key',
            required: false,
            schema: { type: 'string' },
            description: 'Optional admin API key',
            example: 'oto_admin_secret_key_2026',
          },
          {
            in: 'header',
            name: 'x-user-token',
            required: false,
            schema: { type: 'string' },
            description: 'Optional user session token',
            example: 'usr_live_demo_token_123',
          },
        ],
        responses: {
          200: {
            description: 'Caller session profile',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionMeResponse'
                }
              },
            },
          },
        },
      },
    },

    // ==========================================
    // AUTHENTICATION & OTP ENDPOINTS
    // ==========================================
    '/api/auth/register': {
      post: {
        summary: 'Public User Registration (Only public users may register)',
        description: 'Registers a public user into the database with role=guest, status=inactive, email_verified=false, and role_id pointing to the guest role. Generates a random 6-digit OTP code with a 10-minute expiry and sends it via SMTP. Admin registration is prohibited.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Sarah Connor' },
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
                  password: { type: 'string', minLength: 6, example: 'Password123!' },
                  phone: { type: 'string', example: '555-0199' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered as guest. OTP sent via SMTP.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    token: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'guest' },
                        status: { type: 'string', example: 'inactive' },
                        emailVerified: { type: 'boolean', example: false }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Validation failed or admin registration attempted' }
        }
      }
    },
    '/api/auth/verify-otp': {
      post: {
        summary: 'Verify Email with OTP (Transitions status to active)',
        description: 'Verifies the 6-digit OTP code sent via SMTP. OTP expires after 10 minutes. Upon successful verification, user status is upgraded to active, role to user, role_id points to user role, and emailVerified is set to true.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'otp'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
                  otp: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Email verified. Account activated as user.' },
          400: { description: 'Invalid or expired OTP (10 minute limit)' }
        }
      }
    },
    '/api/auth/resend-otp': {
      post: {
        summary: 'Resend OTP (Requires proper token authorization)',
        description: 'Requires a valid Bearer token for the user. Generates a new 10-minute random OTP code and dispatches it via SMTP. Token email must match requested email so no other user can access it.',
        tags: ['Authentication & OTP'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'New 10-minute OTP dispatched' },
          401: { description: 'Authentication required' },
          403: { description: 'Forbidden - Token mismatch or user suspended' }
        }
      }
    },
    '/api/auth/forgot-password': {
      post: {
        summary: 'Forgot Password Request (Public / Unauthenticated)',
        description: 'Public endpoint to initiate forgotten credentials recovery. Dispatches a 10-minute password reset OTP via SMTP.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password reset OTP dispatched' },
          400: { description: 'Email is required' },
          404: { description: 'User not found' },
          403: { description: 'Forbidden - Account suspended' }
        }
      }
    },
    '/api/auth/reset-password': {
      post: {
        summary: 'Reset Password (Public / Unauthenticated with OTP)',
        description: 'Public endpoint to reset password using email, 6-digit OTP code, and new password. Validates OTP and 10-minute expiration window before updating credentials and clearing OTP.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'otp', 'newPassword'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
                  otp: { type: 'string', example: '123456' },
                  newPassword: { type: 'string', minLength: 6, example: 'NewBrandPassword456!' },
                  confirmPassword: { type: 'string', example: 'NewBrandPassword456!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password reset successful' },
          400: { description: 'Invalid or expired OTP, or validation error' },
          404: { description: 'User not found' },
          403: { description: 'Forbidden - Account suspended' }
        }
      }
    },
    '/api/auth/change-password': {
      post: {
        summary: 'Change Password (Authenticated logged-in user)',
        description: 'Reserved exclusively for logged-in users updating active account settings. Requires Bearer Token authorization and verifies correct current password before applying changes.',
        tags: ['Authentication & OTP'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'OldPassword123!' },
                  newPassword: { type: 'string', minLength: 6, example: 'NewPassword456!' },
                  confirmPassword: { type: 'string', example: 'NewPassword456!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password changed successfully' },
          400: { description: 'Incorrect current password or invalid new password' },
          401: { description: 'Authentication required' },
          403: { description: 'Forbidden - Account suspended' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Public User Login',
        description: 'Authenticates public user. Returns JWT session token. Suspended users are forbidden from logging in.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.connor@example.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid email or password' },
          403: { description: 'Account suspended' }
        }
      }
    },

    // ==========================================
    // ADMIN AUTHENTICATION & USER MANAGEMENT
    // ==========================================
    '/api/admin/login': {
      post: {
        summary: 'Admin Login (Admin can login only)',
        description: 'Authenticates administrative account. Only users with admin role can access this endpoint. Returns admin JWT token.',
        tags: ['Admin'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@ototours.com' },
                  password: { type: 'string', example: 'Admin@123456' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Admin login successful with admin token' },
          401: { description: 'Invalid credentials' },
          403: { description: 'Access denied - Non-admin account' }
        }
      }
    },
    '/api/admin/users': {
      get: {
        summary: 'Admin: List all users',
        description: 'Returns paginated users with role and status filtering.',
        tags: ['Admin'],
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'role', schema: { type: 'string' } },
          { in: 'query', name: 'status', schema: { type: 'string' } },
          { in: 'query', name: 'search', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Users list retrieved successfully' }
        }
      },
      post: {
        summary: 'Admin: Add a new user',
        description: 'Allows administrator to create a new user account with role, status, and role_id association.',
        tags: ['Admin'],
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Smith' },
                  email: { type: 'string', format: 'email', example: 'alex.smith@example.com' },
                  password: { type: 'string', minLength: 6, example: 'Password123!' },
                  phone: { type: 'string', example: '555-0105' },
                  role: { type: 'string', enum: ['user', 'guest', 'admin'], default: 'user' },
                  status: { type: 'string', enum: ['active', 'inactive', 'suspended'], default: 'active' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created successfully' },
          409: { description: 'User already exists' }
        }
      }
    },
    '/api/admin/users/{id}/suspend': {
      patch: {
        summary: 'Admin: Suspend or unsuspend a user',
        description: 'Toggles user suspension status. Suspended users cannot access any public routes or login.',
        tags: ['Admin'],
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  suspended: { type: 'boolean', default: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'User suspension state updated' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/admin/users/{id}/status': {
      patch: {
        summary: 'Admin: Update user status',
        description: 'Updates user status directly to active, inactive, or suspended.',
        tags: ['Admin'],
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['active', 'inactive', 'suspended'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'User status updated' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/tours/meta/categories': {
      get: {
        summary: 'Get all tour categories metadata',
        description: 'Returns list of available tour categories for filter navigation and tabs.',
        tags: ['Tours'],
        responses: {
          200: {
            description: 'List of categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 6 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/tours/meta/locations': {
      get: {
        summary: 'Get all tour locations metadata',
        description: 'Returns list of available tour locations (cities, regions) for search and filtering.',
        tags: ['Tours'],
        responses: {
          200: {
            description: 'List of locations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 3 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Location' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/tours/me': {
      get: {
        summary: 'Get current user session profile',
        description: 'Returns the session identity, role (user or admin if authenticated), and permissions for the caller.',
        tags: ['Tours'],
        parameters: [
          {
            in: 'header',
            name: 'x-admin-api-key',
            required: false,
            schema: { type: 'string' },
            description: 'Optional admin API key',
          },
        ],
        responses: {
          200: {
            description: 'User session details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'user' },
                        authenticated: { type: 'boolean', example: false },
                        permissions: { type: 'array', items: { type: 'string' }, example: ['read:tours'] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/tours': {
      get: {
        summary: 'Browse and filter public tours',
        description: 'Retrieve all available tours with optional filtering by category, location, keyword search, and pagination.',
        tags: ['Tours'],
        parameters: [
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Filter tours by category slug or name (e.g. "segway", "ebike", or "all" to retrieve all tours)',
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' },
            description: 'Filter tours by location name or city',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search query matching tour title, description, or highlights',
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'string', default: '10' },
            description: 'Maximum number of tours per page (or "all" to retrieve all tours)',
          },
        ],
        responses: {
          200: {
            description: 'List of matching tours',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 6 },
                    total: { type: 'integer', example: 6 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tour' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/tours/{id}': {
      get: {
        summary: 'Get single tour details by ID or Slug',
        description: 'Retrieve detailed tour information including pricing, overview, key features, highlights, and included items.',
        tags: ['Tours'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Tour UUID, tour_code, or URL slug (e.g. "st-paul-legacy-tour")',
          },
        ],
        responses: {
          200: {
            description: 'Full tour details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tour not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },


    // ==========================================
    // LOCATIONS (PUBLIC) ENDPOINTS
    // ==========================================
    '/api/locations': {
      get: {
        summary: 'Get all tour locations (both featured and non-featured)',
        description: 'Returns all tour destinations (both isFeatured = true and isFeatured = false) with city, state, coordinates, images, and tour counts. Supports optional filtering by ?featured=true/false, ?state, or ?search.',
        tags: ['Locations'],
        parameters: [
          {
            in: 'query',
            name: 'featured',
            schema: { type: 'boolean' },
            description: 'Optional filter by featured status (e.g. true or false). When omitted, returns all locations.'
          },
          {
            in: 'query',
            name: 'state',
            schema: { type: 'string' },
            description: 'Filter by state code or name (e.g. MA, RI)'
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search across city, state, or location name'
          }
        ],
        responses: {
          200: {
            description: 'List of locations retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 4 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/LocationCard' }
                    }
                  }
                },
                example: {
                  success: true,
                  count: 4,
                  data: [
                    {
                      id: 'ff513c6a-0a6d-4317-b73f-1a7a8f7a24fd',
                      locationCode: 'boston-ma',
                      name: 'Boston, MA',
                      city: 'Boston',
                      state: 'MA',
                      country: 'USA',
                      description: 'Historic sites, iconic landmarks, and waterfront views.',
                      imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200',
                      isFeatured: true,
                      displayOrder: 1,
                      latitude: 42.3601,
                      longitude: -71.0589,
                      bookingUrl: '/tours?location=Boston',
                      toursCount: 2
                    },
                    {
                      id: 'ee412b59-9a5c-4206-a62e-0a697e6913ec',
                      locationCode: 'providence-ri',
                      name: 'Providence, RI',
                      city: 'Providence',
                      state: 'RI',
                      country: 'USA',
                      description: "Explore the capital city's rich history and vibrant culture.",
                      imageUrl: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?q=80&w=1200',
                      isFeatured: true,
                      displayOrder: 2,
                      latitude: 41.8240,
                      longitude: -71.4128,
                      bookingUrl: '/tours?location=Providence',
                      toursCount: 1
                    },
                    {
                      id: 'dd301a48-894b-4195-951d-99586d5802db',
                      locationCode: 'newport-ri',
                      name: 'Newport, RI',
                      city: 'Newport',
                      state: 'RI',
                      country: 'USA',
                      description: 'Ocean breeze, Gilded Age mansions, and scenic coast views.',
                      imageUrl: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=1200',
                      isFeatured: true,
                      displayOrder: 3,
                      latitude: 41.4901,
                      longitude: -71.3128,
                      bookingUrl: '/tours?location=Newport',
                      toursCount: 1
                    },
                    {
                      id: 'cc290937-783a-4084-840c-88475c4791ca',
                      locationCode: 'salem-ma',
                      name: 'Salem, MA',
                      city: 'Salem',
                      state: 'MA',
                      country: 'USA',
                      description: 'Witch history, haunted tales, and charming New England streets.',
                      imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=1200',
                      isFeatured: true,
                      displayOrder: 4,
                      latitude: 42.5195,
                      longitude: -70.8967,
                      bookingUrl: '/tours?location=Salem',
                      toursCount: 1
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/api/locations/{identifier}': {
      get: {
        summary: 'Get single location details and associated tours',
        description: 'Lookup a location by UUID or locationCode (e.g. boston-ma), including associated tours.',
        tags: ['Locations'],
        parameters: [
          {
            in: 'path',
            name: 'identifier',
            required: true,
            schema: { type: 'string' },
            description: 'Location UUID or slug code (e.g. boston-ma)'
          }
        ],
        responses: {
          200: {
            description: 'Location details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/LocationCard' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Location not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // BLOGS (PUBLIC) ENDPOINTS
    // ==========================================
    '/api/blogs': {
      get: {
        summary: 'Get paginated list of published blogs (Public)',
        description: 'Returns 3-column grid of blog articles from Figma design with date, time, title, excerpt, cover image, category, and read time. Only visible, published blogs are returned. Users have read-only access.',
        tags: ['Blogs'],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 9 }, description: 'Number of blogs per page (default 9 matching Figma grid)' },
          { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category (e.g. Insights, Local History)' },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search keywords in title, excerpt, or content' },
          { in: 'query', name: 'sort', schema: { type: 'string', enum: ['newest', 'oldest', 'popular', 'order'] }, description: 'Sort order (default newest)' }
        ],
        responses: {
          200: {
            description: 'Paginated list of visible blogs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 9 },
                    total: { type: 'integer', example: 9 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Blog' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/blogs/{identifier}': {
      get: {
        summary: 'Get single blog post details (Public)',
        description: 'Read complete blog post details by URL slug (e.g. discover-minneapolis-like-a-local) or UUID. Increments view count. Hidden blogs return 404 to public users.',
        tags: ['Blogs'],
        parameters: [
          { in: 'path', name: 'identifier', required: true, schema: { type: 'string' }, description: 'Blog slug or UUID' }
        ],
        responses: {
          200: {
            description: 'Blog post details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Blog' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Blog not found or is hidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    '/api/admin/tours': {
      get: {
        summary: 'List all tours for admin management',
        description: 'Retrieve all tours including pagination metadata, with optional search and category filters.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Keyword search on tour title or description',
          },
          {
            in: 'query',
            name: 'categoryId',
            schema: { type: 'string' },
            description: 'Filter by exact category ID',
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 10 },
            description: 'Max tours per page',
          },
        ],
        responses: {
          200: {
            description: 'List of tours for admin',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 6 },
                    total: { type: 'integer', example: 6 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tour' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new tour',
        description: 'Add a new tour with automatic slug generation and input validation.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TourCreateInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Tour created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Tour created successfully' },
                    data: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/admin/tours/{id}': {
      get: {
        summary: 'Get single tour details by ID',
        description: 'Retrieve detailed tour information for admin editing.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Tour unique ID or slug',
          },
        ],
        responses: {
          200: {
            description: 'Tour retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tour not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Full update / replace a tour',
        description: 'Fully update tour details with mandatory required fields validation.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Tour ID or slug',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TourCreateInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Tour updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Tour updated successfully' },
                    data: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Tour not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Partial update of a tour',
        description: 'Modify only specified fields of an existing tour.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Tour ID or slug',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TourUpdateInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Tour updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Tour updated successfully' },
                    data: { $ref: '#/components/schemas/Tour' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Tour not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a tour',
        description: 'Permanently remove a tour by its ID or slug.',
        tags: ['Admin Tours'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Tour ID or slug to delete',
          },
        ],
        responses: {
          200: {
            description: 'Tour deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Tour deleted successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'st-paul-legacy-tour' },
                        title: { type: 'string', example: 'St. Paul Legacy Tour' },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tour not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/admin/categories': {
      get: {
        summary: 'List all categories with tour count',
        description: 'Retrieve all categories along with computed tourCount showing how many tours belong to each.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: 'Categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 6 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new category',
        description: 'Add a new tour category. Auto-generates an ID slug if not provided.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryCreateInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category created successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Conflict - category with ID or name already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/admin/categories/{id}': {
      get: {
        summary: 'Get category by ID',
        description: 'Retrieve details of a specific category including its active tourCount and assigned tours.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category UUID or category_code (e.g. "segway", "ebike")',
          },
        ],
        responses: {
          200: {
            description: 'Category details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Full update of a category',
        description: 'Update name and badge of an existing category. Updates associated tours with new category label.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryCreateInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category updated successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Partial update of a category',
        description: 'Update specific fields (name or badge) of a category.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryUpdateInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category updated successfully' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete category and handle cascade',
        description: 'Remove category by ID. Safely cascades by unlinking tours previously assigned to this category.',
        tags: ['Admin Categories'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID to delete',
          },
        ],
        responses: {
          200: {
            description: 'Category deleted and cascade processed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Category deleted successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'helicopter' },
                        name: { type: 'string', example: 'Helicopter Tours' },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    // ==========================================
    // EVENTS ENDPOINTS (PUBLIC)
    // ==========================================
    '/api/events': {
      get: {
        summary: 'List active event types',
        description: 'Returns all 4 active event categories (Corporate Event, School Groups, Private Celebration, Special Events) strictly matching the Figma design.',
        tags: ['Events'],
        parameters: [
          { name: 'active', in: 'query', schema: { type: 'boolean', default: true }, description: 'Filter by active status' }
        ],
        responses: {
          200: {
            description: 'List of active event types',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 4 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/EventType' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/{identifier}': {
      get: {
        summary: 'Get single event type details',
        description: 'Lookup event details by slug (e.g. corporate-event), eventCode, or UUID.',
        tags: ['Events'],
        parameters: [
          { name: 'identifier', in: 'path', required: true, schema: { type: 'string' }, description: 'Event slug, eventCode, or UUID' }
        ],
        responses: {
          200: {
            description: 'Event type details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/EventType' }
                  }
                }
              }
            }
          },
          404: { description: 'Event not found' }
        }
      }
    },
    '/api/events/meta/page-structure': {
      get: {
        summary: 'Get Figma landing page structure and 5-step work process',
        description: 'Returns hero pitch, 6 value pillars (Why Choose Us), and 5-step work process (Submit Inquiry -> Discuss Requirements -> Customize Tour -> Confirm Booking -> Enjoy Your Events).',
        tags: ['Events'],
        responses: {
          200: {
            description: 'Page structure and metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/gallery': {
      get: {
        summary: 'Get event photos for photo grid (View More Photos)',
        description: 'Returns paginated photo assets with captions and event associations.',
        tags: ['Events'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } }
        ],
        responses: {
          200: {
            description: 'Paginated photo gallery',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 6 },
                    total: { type: 'integer', example: 12 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 2 },
                    data: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/inquiries': {
      post: {
        summary: 'Submit event quote / inquiry request',
        description: 'Customer inquiry submission corresponding to Figma "Request a Quote" action. Generates an inquiry code (EVT-YYYY-XXXX).',
        tags: ['Events'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InquiryInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Inquiry received successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Event inquiry submitted successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        inquiryCode: { type: 'string', example: 'EVT-2026-9B4F1A' },
                        status: { type: 'string', example: 'pending' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Validation error' }
        }
      }
    },
    '/api/events/inquiries/status': {
      get: {
        summary: 'Customer status lookup for submitted quote inquiry',
        description: 'Lookup current inquiry status and quote amount using inquiryCode and email.',
        tags: ['Events'],
        parameters: [
          { name: 'code', in: 'query', required: true, schema: { type: 'string' }, description: 'Inquiry code (e.g. EVT-2026-9B4F1A)' },
          { name: 'email', in: 'query', required: true, schema: { type: 'string' }, description: 'Customer email address' }
        ],
        responses: {
          200: {
            description: 'Inquiry status details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/EventInquiry' }
                  }
                }
              }
            }
          },
          404: { description: 'Inquiry not found' }
        }
      }
    },

    // ==========================================
    // EVENTS ADMIN ENDPOINTS (REQUIRES API KEY)
    // ==========================================
    '/api/admin/events': {
      get: {
        summary: 'Admin: List all event types',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: 'List of all event types',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/EventType' } }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        summary: 'Admin: Create new event category',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Festival Tour' },
                  eventCode: { type: 'string', example: 'festival-tour' },
                  tagline: { type: 'string' },
                  description: { type: 'string' },
                  subOfferings: { type: 'array', items: { type: 'string' } },
                  maxRidersCapacity: { type: 'integer', default: 80 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created successfully' },
          400: { description: 'Validation failed' }
        }
      }
    },
    '/api/admin/events/{id}': {
      put: {
        summary: 'Admin: Update event category',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        },
        responses: {
          200: { description: 'Updated successfully' },
          404: { description: 'Event not found' }
        }
      },
      delete: {
        summary: 'Admin: Delete event category',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Deleted successfully' },
          404: { description: 'Event not found' }
        }
      }
    },
    '/api/admin/events/inquiries': {
      get: {
        summary: 'Admin: List quote inquiries with pagination and filters',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'under_review', 'quoted', 'confirmed', 'completed', 'cancelled'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          200: {
            description: 'Paginated inquiries list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/EventInquiry' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/events/inquiries/{id}': {
      get: {
        summary: 'Admin: Get inquiry details by ID or code',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Inquiry details' },
          404: { description: 'Inquiry not found' }
        }
      }
    },
    '/api/admin/events/inquiries/{id}/status': {
      patch: {
        summary: 'Admin: Update quote status, price, and internal notes',
        tags: ['Admin Events'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['pending', 'under_review', 'quoted', 'confirmed', 'completed', 'cancelled'], example: 'quoted' },
                  quoteAmount: { type: 'number', example: 1850.00 },
                  internalNotes: { type: 'string', example: 'Sent custom quote with audio guide included.' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Status updated successfully' },
          400: { description: 'Invalid status' },
          404: { description: 'Inquiry not found' }
        }
      }
    },

    // ==========================================
    // CONTACT US & ABOUT US ENDPOINTS (PUBLIC)
    // ==========================================
    '/api/contact': {
      get: {
        summary: 'Get Contact Us page details & map location',
        description: 'Returns GET IN TOUCH contact cards, address, email, phone, business hours, form subjects, and map coordinates strictly based on Figma design.',
        tags: ['Contact & About'],
        responses: {
          200: {
            description: 'Contact details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ContactInfo' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/contact/messages': {
      post: {
        summary: 'Submit message from SEND US A MESSAGE form',
        description: 'Handles Contact Us form submissions and returns confirmation with unique reference code (MSG-YYYY-XXXX).',
        tags: ['Contact & About'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactMessageInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Message sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Your message has been sent successfully.' },
                    data: {
                      type: 'object',
                      properties: {
                        referenceCode: { type: 'string', example: 'MSG-2026-F9A1B2' },
                        status: { type: 'string', example: 'new' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Validation error' }
        }
      }
    },
    '/api/about': {
      get: {
        summary: 'Get About Us / Our Story page content',
        description: 'Returns Our Story narrative, mission headline, paragraphs, MEET OUR TEAM CTA, and storefront/team images strictly based on Figma design.',
        tags: ['Contact & About'],
        responses: {
          200: {
            description: 'About Us story narrative and media',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/AboutStory' }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // CONTACT US & ABOUT US (ADMIN MANAGEMENT)
    // ==========================================
    '/api/admin/contact/messages': {
      get: {
        summary: 'Admin: List submitted contact messages',
        description: 'Returns a paginated list of customer inquiries submitted through the Contact Us form, filterable by workflow status and text search.',
        tags: ['Admin Content'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['new', 'in_progress', 'responded', 'archived'],
              example: 'new'
            },
            description: 'Filter inquiries by workflow status'
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string', example: 'john.doe@example.com' },
            description: 'Search by first name, last name, email, subject, or reference code'
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1, example: 1 },
            description: 'Page number for pagination'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10, example: 10 },
            description: 'Number of items per page'
          }
        ],
        responses: {
          200: {
            description: 'Paginated list of contact messages retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    total: { type: 'integer', example: 24 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 3 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ContactMessage' }
                    }
                  }
                },
                example: {
                  success: true,
                  count: 1,
                  total: 24,
                  page: 1,
                  totalPages: 3,
                  data: [
                    {
                      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
                      referenceCode: 'MSG-2026-F9A1B2',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john.doe@example.com',
                      phone: '(319) 555-9876',
                      subject: 'Tour Booking & Reservation',
                      message: 'Interested in booking a weekend morning tour for 4 people.',
                      status: 'new',
                      internalNotes: null,
                      createdAt: '2026-10-06T14:20:00.000Z',
                      updatedAt: '2026-10-06T14:20:00.000Z'
                    }
                  ]
                }
              }
            }
          },
          401: {
            description: 'Admin authorization required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: 'Admin authorization required. Please provide a valid admin API key in the x-admin-api-key or Authorization header.',
                    statusCode: 401
                  }
                }
              }
            }
          },
          403: {
            description: 'Invalid admin credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: 'Invalid admin credentials. Access forbidden.',
                    statusCode: 403
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/contact/messages/{id}': {
      get: {
        summary: 'Admin: Get single contact message',
        description: 'Fetch complete details of a specific contact message by UUID or human-readable reference code (e.g. MSG-2026-F9A1B2).',
        tags: ['Admin Content'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
            description: 'Message UUID or Reference Code (e.g. MSG-2026-F9A1B2)'
          }
        ],
        responses: {
          200: {
            description: 'Message details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ContactMessage' }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
                    referenceCode: 'MSG-2026-F9A1B2',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '(319) 555-9876',
                    subject: 'Tour Booking & Reservation',
                    message: 'Interested in booking a weekend morning tour for 4 people.',
                    status: 'new',
                    internalNotes: 'Customer called back and requested 10:00 AM Segway tour.',
                    createdAt: '2026-10-06T14:20:00.000Z',
                    updatedAt: '2026-10-06T14:25:00.000Z'
                  }
                }
              }
            }
          },
          401: {
            description: 'Admin authorization required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Message not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: "Contact message 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' not found",
                    statusCode: 404
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/contact/messages/{id}/status': {
      patch: {
        summary: 'Admin: Update contact message status & internal notes',
        description: 'Update message workflow state (new, in_progress, responded, archived) and record coordinator internal follow-up notes.',
        tags: ['Admin Content'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
            description: 'Message UUID or Reference Code'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactMessageStatusUpdate' },
              example: {
                status: 'in_progress',
                internalNotes: 'Replied to customer via email with weekend availability.'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Message status updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Contact message status updated successfully' },
                    data: { $ref: '#/components/schemas/ContactMessage' }
                  }
                },
                example: {
                  success: true,
                  message: 'Contact message status updated successfully',
                  data: {
                    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
                    referenceCode: 'MSG-2026-F9A1B2',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '(319) 555-9876',
                    subject: 'Tour Booking & Reservation',
                    message: 'Interested in booking a weekend morning tour for 4 people.',
                    status: 'in_progress',
                    internalNotes: 'Replied to customer via email with weekend availability.',
                    createdAt: '2026-10-06T14:20:00.000Z',
                    updatedAt: '2026-10-06T14:30:00.000Z'
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid status value',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: "Invalid status 'invalid'. Allowed: new, in_progress, responded, archived",
                    statusCode: 400
                  }
                }
              }
            }
          },
          401: {
            description: 'Admin authorization required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Message not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/admin/contact/info': {
      put: {
        summary: 'Admin: Update Contact Us page details & hours',
        description: 'Updates the contact email, support telephone, street address, operating business hours, subject choices, and map pin coordinates displayed on the Contact Us screen.',
        tags: ['Admin Content'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactInfo' },
              example: {
                hero: {
                  badge: 'CONTACT',
                  title: 'CONTACT US',
                  heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
                },
                getInTouch: {
                  title: 'GET IN TOUCH',
                  subtitle: 'Have questions or Need assistance? Reach out to our team - We are happy to help',
                  email: 'michelle.rivera@example.com',
                  phone: '(319) 555-0115',
                  address: '3517 W. Gray St. Utica, Pennsylvania 57867',
                  businessHours: 'Open 24 Hours'
                },
                formSubjects: [
                  'General Inquiry',
                  'Tour Booking & Reservation',
                  'Private Events & Group Tours',
                  'Partnerships & Media',
                  'Customer Feedback'
                ],
                mapLocation: {
                  locationName: 'OTO Tours',
                  address: '3517 W. Gray St. Utica, Pennsylvania 57867',
                  city: 'Utica',
                  state: 'Pennsylvania',
                  postalCode: '57867',
                  latitude: 40.63,
                  longitude: -73.97
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Contact info updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Contact information updated successfully' },
                    data: { $ref: '#/components/schemas/ContactInfo' }
                  }
                },
                example: {
                  success: true,
                  message: 'Contact information updated successfully',
                  data: {
                    hero: {
                      badge: 'CONTACT',
                      title: 'CONTACT US',
                      heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
                    },
                    getInTouch: {
                      title: 'GET IN TOUCH',
                      subtitle: 'Have questions or Need assistance? Reach out to our team - We are happy to help',
                      email: 'michelle.rivera@example.com',
                      phone: '(319) 555-0115',
                      address: '3517 W. Gray St. Utica, Pennsylvania 57867',
                      businessHours: 'Open 24 Hours'
                    },
                    formSubjects: [
                      'General Inquiry',
                      'Tour Booking & Reservation',
                      'Private Events & Group Tours',
                      'Partnerships & Media',
                      'Customer Feedback'
                    ],
                    mapLocation: {
                      locationName: 'OTO Tours',
                      address: '3517 W. Gray St. Utica, Pennsylvania 57867',
                      city: 'Utica',
                      state: 'Pennsylvania',
                      postalCode: '57867',
                      latitude: 40.63,
                      longitude: -73.97
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Admin authorization required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/admin/about': {
      put: {
        summary: 'Admin: Update About Us / Our Story narrative',
        description: 'Updates the Our Story mission narrative, headline, paragraphs, button call-to-action text, and storefront/team panoramic imagery displayed on the About Us screen.',
        tags: ['Admin Content'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AboutStory' },
              example: {
                hero: {
                  badge: 'ABOUT US',
                  title: 'OUR STORY',
                  heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
                },
                story: {
                  headline: 'LOCAL ROOTS. UNFORGETTABLE EXPERIENCES.',
                  paragraphs: [
                    'OTO Tours was founded with a simple idea: combine the thrill of riding a Segway with the power of storytelling.',
                    'What started as a small team of passionate locals has grown into one of the most trusted names in guided city tours.',
                    'We take pride in showcasing the real stories, hidden gems, and iconic landmarks that make each city unique.'
                  ],
                  cta: {
                    label: 'MEET OUR TEAM',
                    action: 'view_team'
                  },
                  storefrontImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
                  teamPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600'
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'About story updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'About Us story updated successfully' },
                    data: { $ref: '#/components/schemas/AboutStory' }
                  }
                },
                example: {
                  success: true,
                  message: 'About Us story updated successfully',
                  data: {
                    hero: {
                      badge: 'ABOUT US',
                      title: 'OUR STORY',
                      heroImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600'
                    },
                    story: {
                      headline: 'LOCAL ROOTS. UNFORGETTABLE EXPERIENCES.',
                      paragraphs: [
                        'OTO Tours was founded with a simple idea: combine the thrill of riding a Segway with the power of storytelling.',
                        'What started as a small team of passionate locals has grown into one of the most trusted names in guided city tours.',
                        'We take pride in showcasing the real stories, hidden gems, and iconic landmarks that make each city unique.'
                      ],
                      cta: {
                        label: 'MEET OUR TEAM',
                        action: 'view_team'
                      },
                      storefrontImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
                      teamPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Admin authorization required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // ADMIN LOCATIONS MANAGEMENT
    // ==========================================
    '/api/admin/locations': {
      get: {
        summary: 'List all locations with admin metadata',
        description: 'Admin paginated list of locations with total tour associations and search.',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'featured', schema: { type: 'boolean' } }
        ],
        responses: {
          200: {
            description: 'Admin locations list retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 10 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 1 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/LocationCard' } }
                  }
                }
              }
            }
          },
          401: { description: 'Admin authorization required' }
        }
      },
      post: {
        summary: 'Create a new location',
        description: 'Create a new canonical tour destination with image, description, and coordinates.',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LocationCreateInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Location created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Location created successfully' },
                    data: { $ref: '#/components/schemas/LocationCard' }
                  }
                }
              }
            }
          },
          400: { description: 'Validation failed' },
          409: { description: 'Location code already exists' }
        }
      }
    },
    '/api/admin/locations/{id}': {
      get: {
        summary: 'Get location details by ID',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Location details' },
          404: { description: 'Location not found' }
        }
      },
      put: {
        summary: 'Update location completely',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LocationUpdateInput' } } }
        },
        responses: {
          200: { description: 'Location updated successfully' },
          404: { description: 'Location not found' }
        }
      },
      patch: {
        summary: 'Partially update location',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LocationUpdateInput' } } }
        },
        responses: {
          200: { description: 'Location updated successfully' },
          404: { description: 'Location not found' }
        }
      },
      delete: {
        summary: 'Delete location',
        tags: ['Admin Locations'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Location deleted successfully' },
          400: { description: 'Cannot delete location linked to tours' },
          404: { description: 'Location not found' }
        }
      }
    },

    // ==========================================
    // BLOGS (ADMIN) ENDPOINTS
    // ==========================================
    '/api/admin/blogs': {
      get: {
        summary: 'List all blogs including hidden posts (Admin)',
        description: 'Retrieve all blogs with pagination, search, category, and status filtering (all, published, hidden, draft).',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['all', 'published', 'hidden', 'draft'] }, description: 'Filter by visibility status' },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Search keyword' },
          { in: 'query', name: 'category', schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Admin list of blogs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Blog' } }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        summary: 'Create a new blog post (Admin)',
        description: 'Admin creates a blog with title, slug, excerpt, content/details, image, date, time, author, category, isHidden, etc.',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BlogInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Blog created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog created successfully' },
                    data: { $ref: '#/components/schemas/Blog' }
                  }
                }
              }
            }
          },
          400: { description: 'Validation failed' },
          409: { description: 'Blog slug already exists' }
        }
      }
    },
    '/api/admin/blogs/{id}': {
      get: {
        summary: 'Get single blog post by ID or slug (Admin)',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Blog post details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Blog' }
                  }
                }
              }
            }
          },
          404: { description: 'Blog not found' }
        }
      },
      put: {
        summary: 'Update blog completely (Admin)',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } }
        },
        responses: {
          200: { description: 'Blog updated successfully' },
          404: { description: 'Blog not found' }
        }
      },
      patch: {
        summary: 'Partially update blog fields (Admin)',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } }
        },
        responses: {
          200: { description: 'Blog updated successfully' },
          404: { description: 'Blog not found' }
        }
      },
      delete: {
        summary: 'Delete blog post (Admin)',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Blog deleted successfully' },
          404: { description: 'Blog not found' }
        }
      }
    },
    '/api/admin/blogs/{id}/visibility': {
      patch: {
        summary: 'Hide or unhide a blog post from public view (Admin)',
        description: 'Quickly toggle or set the isHidden status of a blog. When isHidden=true, the blog is omitted from public queries and returns 404 to users.',
        tags: ['Admin Blogs'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogVisibilityInput' } } }
        },
        responses: {
          200: {
            description: 'Blog visibility updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Blog has been hidden from public view' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        slug: { type: 'string' },
                        title: { type: 'string' },
                        isHidden: { type: 'boolean' },
                        status: { type: 'string', example: 'hidden' }
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Blog not found' }
        }
      }
    },
    // ==========================================
    // AUTHENTICATION & OTP ENDPOINTS
    // ==========================================
    '/api/auth/register': {
      post: {
        summary: 'Register new user as guest with inactive status',
        description: 'Saves user in DB with role=guest and status=inactive. Dispatches a 6-digit verification OTP code to the provided email via SMTP. Issues an initial unverified guest session JWT.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegisterInput'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered as guest. OTP sent via SMTP.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          400: {
            description: 'Missing or invalid user registration data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          409: {
            description: 'An active user account with this email address already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/verify-otp': {
      post: {
        summary: 'Verify 6-digit email OTP',
        description: 'Validates 6-digit OTP code received via SMTP. Upon successful verification, updates the account to role=user and status=active (emailVerified=true). Issues an active user JWT token.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VerifyOtpInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Email verified successfully. Account activated as user.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          400: {
            description: 'Invalid or expired OTP code',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          404: {
            description: 'User with specified email address not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/resend-otp': {
      post: {
        summary: 'Resend OTP verification code via SMTP',
        description: 'Generates a fresh 6-digit OTP code and delivers it to the registered user email address via SMTP.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResendOtpInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Fresh OTP code sent to email',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'A fresh OTP verification code has been sent to your email.' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Account is already active or invalid email',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          404: {
            description: 'User with specified email address not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'User Login',
        description: 'Authenticates user email and password. If the user has not verified their email OTP, logs in with role=guest and status=inactive. If the user is verified, logs in with role=user and status=active.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLoginInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful. Returns session JWT and user profile.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          400: {
            description: 'Email and password are required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          401: {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/token': {
      post: {
        summary: 'Issue Dev / Testing JWT Token',
        description: 'Generates a signed JWT token with customizable user payload claims (id, email, name, role, status) for automated testing, API exploration, and integration validation.',
        tags: ['Authentication & OTP'],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TokenIssueInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'JWT token issued successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Get Current User Profile & Session (Auth Alias)',
        description: 'Alias endpoint for /api/me returning current caller identity, role, verification status, and permissions.',
        tags: ['Authentication & OTP'],
        security: [
          {},
          { BearerAuth: [] },
          { ApiKeyAuth: [] }
        ],
        responses: {
          200: {
            description: 'Caller profile and session data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionMeResponse'
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // HOMEPAGE ENDPOINTS (FIGMA FINAL VERSION)
    // ==========================================
    '/api/home': {
      get: {
        summary: 'Consolidated Final Homepage Payload',
        description: 'Returns all 14 visual sections of the Figma homepage in a single high-performance payload: Brand identity, Hero banner, Explore Experiences categories & carousel, Unforgettable Travel Experiences 3-card grid, Customer Testimonial quote, Safety First metrics & trust stats, 23 Years milestone story, Made in USA craft fleet engineering, Gear Up adventure merchandise, Driver License Program, Inside the Segway anatomy hotspots, Recent Blogs, Instagram Social Feed, and Footer with navigation links & contact details.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Full homepage composite payload retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeOverviewResponse'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/overview': {
      get: {
        summary: 'Consolidated Final Homepage Payload (Overview Alias)',
        description: 'Alias for /api/home returning all 14 visual sections of the Figma homepage in a single composite payload.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Full homepage composite payload retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeOverviewResponse'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/hero': {
      get: {
        summary: 'Section 1: Homepage Hero Banner & Booking CTA',
        description: 'Returns hero headline, subheadline, call-to-action buttons (Book Tours & Explore Fleet), badge, and background visual.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Hero section data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeHeroData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/experiences': {
      get: {
        summary: 'Section 3: Explore Experiences (Categories & Carousel)',
        description: 'Returns category filter tabs (All, Segway, E-Bike, etc.) and signature tour highlights.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Experiences data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeExperiencesData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/featured-tours': {
      get: {
        summary: 'Section 4: Unforgettable Travel Experiences (3-Card Grid)',
        description: 'Returns top curated tour cards grid with pricing, duration, ratings, and booking URLs.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Featured travel tours retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeFeaturedToursData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/stats': {
      get: {
        summary: 'Section 5: Safety First Metrics & Trust Stats',
        description: 'Returns trust metrics: 50k+ Happy Riders, 100+ Expert Guides, 100% Safety Record, and 4.9/5 Average Rating.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Safety metrics and stats retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeStatsData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/testimonial': {
      get: {
        summary: 'Section 6: Verified Customer Testimonial Quote',
        description: 'Returns customer endorsement quote, reviewer name, tour designation, and 5-star rating.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Testimonial quote retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeTestimonialData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/story': {
      get: {
        summary: 'Section 7: 23 Years Milestone Company Story',
        description: 'Returns company story narrative since 2003, team photography, and about page link.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Company story retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeStoryData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/usa-craft': {
      get: {
        summary: 'Section 8: Made in USA Fleet Engineering',
        description: 'Returns details on American engineering, custom vehicle comfort, and zero emissions balance technology.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'USA craft details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeUsaCraftData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/gear': {
      get: {
        summary: 'Section 9: Gear Up For Your Adventure (Merchandise)',
        description: 'Returns official OTO Tours merchandise, travel essentials, and safety apparel preview items.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Gear products preview retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeGearData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/license-program': {
      get: {
        summary: 'Section 10: Certified Rider Driver License Program',
        description: 'Returns details on the 15-minute rider training certification and rental benefits.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Driver license program data retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeLicenseProgramData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/vehicle-specs': {
      get: {
        summary: 'Section 11: Inside the Segway Anatomy Hotspots',
        description: 'Returns interactive vehicle blueprint hotspots: LeanSteer handlebar, dual lithium batteries, all-terrain tires, high-lumen LEDs, and redundant gyroscopes.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Vehicle specifications and hotspots retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeVehicleSpecsData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/blogs': {
      get: {
        summary: 'Section 12: Recent Blog Posts Preview',
        description: 'Returns top 3 recent published blog articles with title, excerpt, read time, and cover imagery.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Recent blog posts retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeBlogsData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/social-feed': {
      get: {
        summary: 'Section 13: Instagram Gallery Social Showcase',
        description: 'Returns social handle @oto_tours, Instagram link, and 5 curated tour action shots.',
        tags: ['Homepage'],
        responses: {
          200: {
            description: 'Social feed photos retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/HomeSocialFeedData'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/home/newsletter': {
      post: {
        summary: 'Section 14: Subscribe to oTo Tours Newsletter',
        description: 'Subscribes user email to tour announcements, updates, and seasonal promo codes. Email is stored in PostgreSQL site_content.',
        tags: ['Homepage'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewsletterInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Subscribed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Thank you for subscribing to oTo Tours updates!' },
                    email: { type: 'string', example: 'rider@example.com' }
                  }
                }
              }
            }
          },
          400: {
            description: 'A valid email address is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // ADMIN HOMEPAGE CMS ENDPOINTS
    // ==========================================
    '/api/admin/home/sections': {
      get: {
        summary: 'Admin: Get all homepage CMS sections',
        description: 'Retrieves all 9 configurable homepage sections stored in PostgreSQL site_content with defaults fallback.',
        tags: ['Admin Homepage CMS'],
        security: [{ ApiKeyAuth: [] }],
        responses: {
          200: {
            description: 'All homepage sections retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      description: 'Map of section keys to section configuration objects'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing admin API key',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/home/sections/{sectionKey}': {
      get: {
        summary: 'Admin: Get specific homepage CMS section',
        description: 'Retrieves configuration data for a specific section key (e.g. homepage_hero, homepage_quote, homepage_stats, homepage_story, homepage_usa_craft, homepage_gear, homepage_license_program, homepage_vehicle_specs, homepage_social_feed).',
        tags: ['Admin Homepage CMS'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'sectionKey',
            required: true,
            schema: { type: 'string' },
            description: 'Section key identifier',
            example: 'homepage_hero'
          }
        ],
        responses: {
          200: {
            description: 'Section configuration retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    sectionKey: { type: 'string', example: 'homepage_hero' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing admin API key',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Admin: Update specific homepage CMS section',
        description: 'Persists updated JSON configuration for a specific section key to the PostgreSQL site_content database table.',
        tags: ['Admin Homepage CMS'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'sectionKey',
            required: true,
            schema: { type: 'string' },
            description: 'Section key identifier',
            example: 'homepage_hero'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdminHomeSectionUpdateInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Section updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: "Homepage section 'homepage_hero' updated successfully" },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing admin API key',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/api/admin/home': {
      put: {
        summary: 'Admin: Bulk update homepage CMS sections',
        description: 'Updates multiple homepage sections in a single atomic payload by passing a dictionary of section keys and their updated JSON configurations.',
        tags: ['Admin Homepage CMS'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdminHomeBulkUpdateInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Homepage sections updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Homepage sections updated successfully' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized - Invalid or missing admin API key',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
