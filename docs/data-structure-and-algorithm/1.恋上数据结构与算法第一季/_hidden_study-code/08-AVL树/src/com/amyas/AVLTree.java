package com.amyas;

public class AVLTree<E> extends BST<E> {
  public AVLTree() {
  }

  public AVLTree(Comparator<E> comparator) {
    super(comparator);
  }

  @Override
  protected void afterAdd(Node<E> node) {
    while ((node = node.parent) != null) {
      if (isBalanced(node)) { // node平衡
        // 更新高度
        updateHeight(node);
      } else { // 不平衡
        // 恢复平衡
        reblance(node);
        // 整棵树恢复平衡，跳出
        break;
      }
    }
  }

  @Override
  protected Node<E> createNode(E element, Node<E> parent) {
    return new AVLNode<>(element, parent);
  }

  /**
   * 恢复平衡
   * 
   * @param node 距离新增元素高度最低的那个不平衡节点
   */
  private void reblance(Node<E> grand) {
    Node<E> parent = ((AVLNode<E>) grand).tallerChild();
    Node<E> node = ((AVLNode<E>) parent).tallerChild();
  }

  private boolean isBalanced(Node<E> node) {
    return Math.abs(((AVLNode<E>) node).balanceFactor()) <= 1;
  }

  private void updateHeight(Node<E> node) {
    ((AVLNode<E>) node).updateHeight();
  }

  private static class AVLNode<E> extends Node<E> {
    int height = 1;

    public AVLNode(E element, Node<E> parent) {
      super(element, parent);
    }

    // 平衡因子
    public int balanceFactor() {
      int leftHeight = left == null ? 0 : ((AVLNode<E>) left).height;
      int rightHeight = right == null ? 0 : ((AVLNode<E>) right).height;
      return leftHeight - rightHeight;
    }

    public void updateHeight() {
      int leftHeight = left == null ? 0 : ((AVLNode<E>) left).height;
      int rightHeight = right == null ? 0 : ((AVLNode<E>) right).height;
      height = 1 + Math.max(leftHeight, rightHeight);
    }

    public Node<E> tallerChild() {
      int leftHeight = left == null ? 0 : ((AVLNode<E>) left).height;
      int rightHeight = right == null ? 0 : ((AVLNode<E>) right).height;
      if (leftHeight > rightHeight) {
        return left;
      }
      if (leftHeight < rightHeight) {
        return right;
      }
      return isLeftChild() ? left : right;
    }
  }
}
