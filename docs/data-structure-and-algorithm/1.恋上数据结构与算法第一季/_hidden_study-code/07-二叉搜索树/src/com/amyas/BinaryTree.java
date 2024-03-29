package com.amyas;

import java.util.LinkedList;
import java.util.Queue;

import com.amyas.printer.BinaryTreeInfo;

@SuppressWarnings("unchecked")
public class BinaryTree<E> implements BinaryTreeInfo {
  protected int size;
  protected Node<E> root;

  protected static class Node<E> {
    E element;
    Node<E> left;
    Node<E> right;
    Node<E> parent;

    public boolean isLeaf() {
      return left == null && right == null;
    }

    public boolean hasTwoChildren() {
      return left != null && right != null;
    }

    public Node(E element, Node<E> parent) {
      this.element = element;
      this.parent = parent;
    }
  }

  public static abstract class Visitor<E> {
    boolean stop;

    abstract boolean visit(E element);
  }

  public int size() {
    return size;
  }

  public boolean isEmpty() {
    return size == 0;
  }

  public void clear() {
    root = null;
    size = 0;
  }

  public void preorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    preorder(root, visitor);
  }

  private void preorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    visitor.stop = visitor.visit(node.element);
    preorder(node.left, visitor);
    preorder(node.right, visitor);
  }

  public void inorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    inorder(root, visitor);
  }

  private void inorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    inorder(node.left, visitor);
    if (visitor.stop)
      return;
    visitor.stop = visitor.visit(node.element);
    inorder(node.right, visitor);
  }

  public void postorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    postorder(root, visitor);
  }

  private void postorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    postorder(node.left, visitor);
    postorder(node.right, visitor);
    if (visitor.stop)
      return;
    visitor.stop = visitor.visit(node.element);
  }

  public void levelOrder(Visitor<E> visitor) {
    if (root == null || visitor == null)
      return;

    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      if (visitor.visit(node.element)) {
        return;
      }
      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }
    }
  }

  public int height() {
    // 递归遍历法
    return height(root);

    // 非递归遍历法，层序遍历
    // if (root == null)
    // return 0;
    // Queue<Node<E>> queue = new LinkedList<>();
    // queue.offer(root);
    // // 树的高度
    // int height = 0;
    // // 每一层元素数量
    // int levelSize = 1;

    // while (!queue.isEmpty()) {
    // Node<E> node = queue.poll();
    // levelSize--;

    // if (node.left != null) {
    // queue.offer(node.left);
    // }
    // if (node.right != null) {
    // queue.offer(node.right);
    // }

    // if (levelSize == 0) {
    // levelSize = queue.size();
    // height++;
    // }
    // }

    // return height;
  }

  private int height(Node<E> node) {
    if (node == null)
      return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  public boolean isComplete() {
    if (root == null) {
      return false;
    }

    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);

    boolean leaf = false;
    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      if (leaf && !node.isLeaf()) {
        return false;
      }

      if (node.left != null) {
        queue.offer(node.left);
      } else if (node.right != null) {
        return false;
      }
      if (node.right != null) {
        queue.offer(node.right);
      } else {
        leaf = true;
      }
    }

    return true;
  }

  protected Node<E> predecessor(Node<E> node) {
    if (node == null) {
      return null;
    }
    Node<E> p = node.left;

    // 前驱节点在左子树当中(left.right.right.right....)
    if (node.left != null) {
      while (p.right != null) {
        p = p.right;
      }
      return p;
    }

    // 从父节点、祖父节点中寻找前驱节点
    while (node.parent != null && node == node.parent.left) {
      node = node.parent;
    }

    // node.parent == null
    // node == node.parent.right
    return node.parent;
  }

  protected Node<E> successor(Node<E> node) {
    if (node == null) {
      return null;
    }
    Node<E> s = node.right;
    if (node.right != null) {
      while (s.left != null) {
        s = s.left;
      }
      return s;
    }

    while (node.parent != null && node == node.parent.right) {
      node = node.parent;
    }

    return node.parent;
  }

  @Override
  public Object root() {
    return root;
  }

  @Override
  public Object left(Object node) {
    return ((Node<E>) node).left;
  }

  @Override
  public Object right(Object node) {
    return ((Node<E>) node).right;
  }

  @Override
  public Object string(Object node) {
    return ((Node<E>) node).element;
  }
}
