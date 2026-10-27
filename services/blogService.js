'use strict';

const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, Blog } = require('../models');

function generateSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const month = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toUpperCase();
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
}

class BlogService {
  /**
   * Format Blog instance into standard API output
   */
  _formatBlogResponse(blog) {
    const b = blog.toJSON ? blog.toJSON() : blog;
    const pubDate = b.publishedAt || b.published_at || b.createdAt || b.created_at;

    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt || '',
      content: b.content || '',
      details: b.content || '', // Alias matching user requirements
      imageUrl: b.imageUrl || b.image_url || null,
      category: b.category || 'Insights',
      author: b.author || 'OTO Tours',
      readTime: b.readTime || b.read_time || '5 min read',
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      date: formatDate(pubDate),
      time: formatTime(pubDate),
      formattedDate: formatDate(pubDate),
      formattedTime: formatTime(pubDate),
      isPublished: Boolean(b.isPublished !== undefined ? b.isPublished : b.is_published),
      isHidden: Boolean(b.isHidden !== undefined ? b.isHidden : b.is_hidden),
      displayOrder: Number(b.displayOrder !== undefined ? b.displayOrder : (b.display_order || 0)),
      viewsCount: Number(b.viewsCount !== undefined ? b.viewsCount : (b.views_count || 0)),
      tags: Array.isArray(b.tags) ? b.tags : (typeof b.tags === 'string' ? JSON.parse(b.tags) : []),
      createdAt: b.createdAt || b.created_at,
      updatedAt: b.updatedAt || b.updated_at
    };
  }

  /**
   * Find Blog by UUID or slug
   */
  async _findBlogByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

    if (isUUID) {
      return await Blog.findByPk(clean);
    }

    return await Blog.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('slug')), clean.toLowerCase())
    });
  }

  // ==========================================
  // PUBLIC BLOG METHODS (READ-ONLY)
  // ==========================================

  /**
   * Public: Get published and visible blogs with pagination and filters
   */
  async getPublicBlogs(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 9;
    const offset = (page - 1) * limit;

    // Public users can ONLY read published and non-hidden blogs
    const where = {
      isPublished: true,
      isHidden: false
    };

    if (query.category) {
      where.category = { [Op.iLike]: `%${query.category.trim()}%` };
    }

    if (query.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: term } },
        { excerpt: { [Op.iLike]: term } },
        { content: { [Op.iLike]: term } },
        { slug: { [Op.iLike]: term } }
      ];
    }

    let order = [
      ['display_order', 'ASC'],
      ['published_at', 'DESC'],
      ['created_at', 'DESC']
    ];

    if (query.sort === 'newest') {
      order = [['published_at', 'DESC']];
    } else if (query.sort === 'oldest') {
      order = [['published_at', 'ASC']];
    } else if (query.sort === 'popular') {
      order = [['views_count', 'DESC']];
    }

    const { count: total, rows: blogs } = await Blog.findAndCountAll({
      where,
      limit,
      offset,
      order
    });

    const formatted = blogs.map(b => this._formatBlogResponse(b));

    return {
      blogs: formatted,
      meta: {
        total,
        count: formatted.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Public: Get blog details by UUID or slug (increments view count)
   */
  async getPublicBlogBySlugOrId(identifier) {
    const blog = await this._findBlogByIdentifier(identifier);

    // If blog does not exist, or is hidden/unpublished, return 404 to public users
    if (!blog || blog.isHidden || !blog.isPublished) {
      const error = new Error(`Blog '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Increment views count silently
    try {
      await blog.increment('viewsCount', { by: 1 });
    } catch (_) {
      // Continue even if increment fails
    }

    return this._formatBlogResponse(blog);
  }

  // ==========================================
  // ADMIN BLOG METHODS (FULL CRUD + HIDE/SHOW)
  // ==========================================

  /**
   * Admin: Get all blogs with pagination and visibility status filtering
   */
  async getAdminBlogs(query = {}) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = query.limit !== undefined ? Math.max(1, parseInt(query.limit, 10)) : 10;
    const offset = (page - 1) * limit;

    const where = {};

    // Filter by visibility / status
    if (query.status === 'hidden' || query.isHidden === 'true' || query.isHidden === true) {
      where.isHidden = true;
    } else if (query.status === 'published' || query.isHidden === 'false' || query.isHidden === false) {
      where.isHidden = false;
      where.isPublished = true;
    } else if (query.status === 'draft') {
      where.isPublished = false;
    }

    if (query.category) {
      where.category = { [Op.iLike]: `%${query.category.trim()}%` };
    }

    if (query.search) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: term } },
        { excerpt: { [Op.iLike]: term } },
        { content: { [Op.iLike]: term } },
        { slug: { [Op.iLike]: term } },
        { author: { [Op.iLike]: term } }
      ];
    }

    const { count: total, rows: blogs } = await Blog.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'DESC']
      ]
    });

    const formatted = blogs.map(b => this._formatBlogResponse(b));

    return {
      blogs: formatted,
      meta: {
        total,
        count: formatted.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Admin: Get single blog by UUID or slug
   */
  async getAdminBlogById(identifier) {
    const blog = await this._findBlogByIdentifier(identifier);

    if (!blog) {
      const error = new Error(`Blog '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return this._formatBlogResponse(blog);
  }

  /**
   * Admin: Create a new blog post
   */
  async createBlog(payload) {
    const title = payload.title ? payload.title.trim() : '';
    const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(title);

    const existing = await Blog.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('slug')), slug.toLowerCase())
    });

    if (existing) {
      const error = new Error(`A blog with slug '${slug}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const content = payload.content || payload.details || '';
    const excerpt = payload.excerpt ? payload.excerpt.trim() : content.substring(0, 160);

    const created = await Blog.create({
      id: crypto.randomUUID(),
      slug,
      title,
      excerpt,
      content,
      imageUrl: payload.imageUrl ? payload.imageUrl.trim() : null,
      category: payload.category ? payload.category.trim() : 'Insights',
      author: payload.author ? payload.author.trim() : 'OTO Tours',
      readTime: payload.readTime ? payload.readTime.trim() : '5 min read',
      publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : new Date(),
      isPublished: payload.isPublished !== undefined ? Boolean(payload.isPublished) : true,
      isHidden: payload.isHidden !== undefined ? Boolean(payload.isHidden) : false,
      displayOrder: payload.displayOrder !== undefined ? parseInt(payload.displayOrder, 10) : 0,
      tags: Array.isArray(payload.tags) ? payload.tags : []
    });

    return this._formatBlogResponse(created);
  }

  /**
   * Admin: Update blog
   */
  async updateBlog(identifier, payload) {
    const blog = await this._findBlogByIdentifier(identifier);

    if (!blog) {
      const error = new Error(`Blog '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const fields = {};
    if (payload.title !== undefined) fields.title = payload.title.trim();
    if (payload.excerpt !== undefined) fields.excerpt = payload.excerpt.trim();
    if (payload.content !== undefined) fields.content = payload.content;
    if (payload.details !== undefined && payload.content === undefined) fields.content = payload.details;
    if (payload.imageUrl !== undefined) fields.imageUrl = payload.imageUrl ? payload.imageUrl.trim() : null;
    if (payload.category !== undefined) fields.category = payload.category.trim();
    if (payload.author !== undefined) fields.author = payload.author.trim();
    if (payload.readTime !== undefined) fields.readTime = payload.readTime.trim();
    if (payload.publishedAt !== undefined) fields.publishedAt = new Date(payload.publishedAt);
    if (payload.isPublished !== undefined) fields.isPublished = Boolean(payload.isPublished);
    if (payload.isHidden !== undefined) fields.isHidden = Boolean(payload.isHidden);
    if (payload.displayOrder !== undefined) fields.displayOrder = parseInt(payload.displayOrder, 10);
    if (payload.tags !== undefined) fields.tags = Array.isArray(payload.tags) ? payload.tags : [];

    if (payload.slug !== undefined) {
      const newSlug = generateSlug(payload.slug);
      if (newSlug !== blog.slug) {
        const existing = await Blog.findOne({
          where: sequelize.where(sequelize.fn('LOWER', sequelize.col('slug')), newSlug.toLowerCase())
        });
        if (existing) {
          const error = new Error(`A blog with slug '${newSlug}' already exists`);
          error.statusCode = 409;
          throw error;
        }
        fields.slug = newSlug;
      }
    }

    await blog.update(fields);
    return this._formatBlogResponse(blog);
  }

  /**
   * Admin: Toggle hide/unhide status of a blog
   */
  async toggleBlogVisibility(identifier, payload = {}) {
    const blog = await this._findBlogByIdentifier(identifier);

    if (!blog) {
      const error = new Error(`Blog '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    let newHiddenState;
    if (payload.isHidden !== undefined) {
      newHiddenState = Boolean(payload.isHidden);
    } else if (payload.hide !== undefined) {
      newHiddenState = Boolean(payload.hide);
    } else {
      // Toggle current value
      newHiddenState = !blog.isHidden;
    }

    await blog.update({ isHidden: newHiddenState });

    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      isHidden: newHiddenState,
      status: newHiddenState ? 'hidden' : 'visible',
      message: newHiddenState
        ? `Blog '${blog.title}' has been hidden from public view`
        : `Blog '${blog.title}' is now visible to public users`
    };
  }

  /**
   * Admin: Delete blog
   */
  async deleteBlog(identifier) {
    const blog = await this._findBlogByIdentifier(identifier);

    if (!blog) {
      const error = new Error(`Blog '${identifier}' not found`);
      error.statusCode = 404;
      throw error;
    }

    await blog.destroy();

    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      deleted: true
    };
  }
}

module.exports = new BlogService();
